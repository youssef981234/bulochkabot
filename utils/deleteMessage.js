module.exports.deleteMessage = async (message, id) => {
  message.channel
    .fetchMessage(id)
    .then(msg => {
      msg.delete(5000);
    })
    .catch(err => {
      console.log(err);
    });
};
