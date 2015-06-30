Router.configure
  layoutTemplate: 'application'

Router.route '/', ->
  @render('home')
