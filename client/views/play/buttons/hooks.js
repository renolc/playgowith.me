Template.buttons.onRendered(function() {
  $('.ui.dropdown').dropdown({
    direction: 'upward',
    onShow: function() {
      $('.extra.icon').removeClass('sidebar');
      $('.extra.icon').addClass('remove');
    },
    onHide: function() {
      $('.extra.icon').removeClass('remove');
      $('.extra.icon').addClass('sidebar');
    }
  });
});
