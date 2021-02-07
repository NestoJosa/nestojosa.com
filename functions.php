<?php



// Load Stylesheets
function load_css() {
  
  wp_register_style('adobe-fonts', 'https://use.typekit.net/kbs0hyb.css', array(), null, 'all' );
  wp_enqueue_style('adobe-fonts');
      
  wp_register_style('styles-bundle', get_template_directory_uri() . '/dist/css/bundle.css', array(), '1.0', 'all' );
  wp_enqueue_style('styles-bundle'); 
  
}
add_action('wp_enqueue_scripts', 'load_css');


// Load Javascript
function load_js() {
      
  wp_register_script('bootstrap-scripts', get_template_directory_uri() . '/dist/bootstrap_4.0.0/dist/js/bootstrap.bundle.min.js', array('jquery'), null, true );
  wp_enqueue_script('bootstrap-scripts');
  
  wp_enqueue_script( 'scripts-bundle', get_template_directory_uri() . '/dist/js/bundle.js', array(), null, true );
   
}
add_action('wp_enqueue_scripts', 'load_js');




/* 

  Theme Setup

*/
function labore_theme_setup() {

  // Adds <title> tag
  add_theme_support( 'title-tag' );

  // Add post thumbnails
  add_theme_support( 'post-thumbnails' );

  // Add menus
  add_theme_support( 'menus' );

}
add_action( 'after_setup_theme', 'labore_theme_setup');


?>