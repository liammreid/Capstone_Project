exports.generalError = (err, req, res, next) => {
    console.log(err);
    res.render('error', {pageTitle: "Error!"});
}