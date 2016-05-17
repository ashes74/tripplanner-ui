var Sequelize = require('sequelize');
var Place = require('./place');

module.exports = function(db){
  var Hotel = db.define('hotel', {
    name: Sequelize.STRING,
    num_stars: {
      type: Sequelize.INTEGER,
      validate: { min: 1, max: 5 }
    },
    amenities: Sequelize.STRING
  },
{
  getterMethods: {
    myPlace : function(){

      return this.getPlace()
      .then(function(theplace){
        return theplace;
      });
    },
    type: function(){
      return "hotel";
    }
  }
});

  return Hotel;
}
