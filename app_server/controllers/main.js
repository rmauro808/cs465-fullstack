/* GET homepage */
const index = (req, res) => {
    res.render('index', {
        title: 'Tavlr Getaways'});
};
module.exports = {
    index
};