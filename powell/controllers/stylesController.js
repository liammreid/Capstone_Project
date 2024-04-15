const PowellStyle = require("../models/PowellStyle");
const slugify = require('slugify');


exports.getStyles = async (req, res, next) => {
  try {
    const styles = await PowellStyle.find();
    res.render("gallery", { pageTitle: "Gallery", styles, path: req.baseUrl });
  } catch (error) {
    console.log("Error fetching mustache styles:", error);
    next(error);
  }
};

exports.getSingleStyle = async (req, res, next) => {
  const { titleSlug } = req.params;
  try {
    const style = await PowellStyle.findOne({
      titleSlug: titleSlug.toLowerCase(),
    });
    if (!style) {
      const error = new Error("Style not found");
      error.statusCode = 404;
      throw error;
    }
    res.render("gallery-single-post", {
      pageTitle: style.title,
      style,
      path: req.baseUrl,
    });
  } catch (e) {
    console.log("error: ", e);
    next(e);
  }
};

exports.getNewStyle = (req, res, next) => {
  res.render("new-style", {
    pageTitle: "New Style",
    errorMessage: null,
    path: req.baseUrl,
  });
};


exports.postNewStyle = async (req, res, next) => {
  if (!req.files || !req.body.title || !req.body.description) {
    return res.status(400).send('Please provide title, description, and image.');
  }

  const image = req.files.image;
  const title = req.body.title;
  const description = req.body.description;
  const imageName = `${Date.now()}_${image.name}`;
  const imageURL = `images/${imageName}`;
  const titleSlug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });

  // Save image to public/images directory
  await image.mv(`public/images/${imageName}`);

  // Insert data into database
  const style = new MustacheStyle({ title, titleSlug, description, imageURL });
  try {
    await style.save();
    res.redirect('/styles');
  } catch (err) {
    return res.status(500).send(err);
  }
};