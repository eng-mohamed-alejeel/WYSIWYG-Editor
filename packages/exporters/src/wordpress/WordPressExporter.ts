/**
 * WordPress Exporter
 *
 * Exports projects to WordPress theme templates and plugins
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { BaseAdapter } from '../adapters/BaseAdapter';
import { ExportContext } from '../types';

export class WordPressExporter extends BaseAdapter {
  readonly format = 'wordpress' as const;

  async exportProject(project: Project, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context = this.createContext(project, options);
      await this.processAssets(project.assets, context);

      const files: Record<string, string> = {};

      // Generate theme files
      files['style.css'] = this.generateThemeStylesheet(project);
      files['functions.php'] = this.generateFunctionsPhp(project);
      files['index.php'] = this.generateIndexPhp(project);
      files['header.php'] = this.generateHeaderPhp(project);
      files['footer.php'] = this.generateFooterPhp(project);
      files['front-page.php'] = this.generateFrontPagePhp(project, context);

      // Generate page templates
      for (const page of project.pages) {
        if (page.slug !== 'home') {
          files[`page-${page.slug}.php`] = this.generatePageTemplate(page, context);
        }
      }

      // Generate component templates
      files['template-parts/components.php'] = this.generateComponentsPhp(project, context);

      // Generate assets
      files['assets/css/style.css'] = this.generateMainCss(project, context);
      files['assets/js/main.js'] = this.generateMainJs(project);

      // Generate screenshot
      files['screenshot.png'] = this.generateScreenshotPlaceholder();

      return {
        success: true,
        data: {
          files,
          assets: context.assets,
          styles: context.styles,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportPage(page: Page, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context = this.createContext(page as any, options);
      const template = this.generatePageTemplate(page, context);

      return {
        success: true,
        data: { template },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult> {
    try {
      const php = this.generateComponentPhp(component);
      return {
        success: true,
        data: { php },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  validateOptions(options: ExportOptions): boolean {
    return options.format === 'wordpress';
  }

  private generateThemeStylesheet(project: Project): string {
    return `/*
Theme Name: ${project.name}
Theme URI: ${project.metadata.customData?.themeUri || ''}
Description: ${project.description || 'A custom WordPress theme'}
Version: ${project.metadata.version || '1.0.0'}
Author: ${project.metadata.customData?.author || ''}
Author URI: ${project.metadata.customData?.authorUri || ''}
Text Domain: ${this.camelToKebab(project.name)}
Tags: custom-background, threaded-comments, translation-ready
*/`;
  }

  private generateFunctionsPhp(project: Project): string {
    return `<?php
/**
 * ${project.name} functions and definitions
 *
 * @package ${project.name}
 */

if (!defined('_S_VERSION')) {
    define('_S_VERSION', '1.0.0');
}

function ${this.camelToKebab(project.name)}_setup() {
    load_theme_textdomain('${this.camelToKebab(project.name)}', get_template_directory() . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-background', apply_filters('${this.camelToKebab(project.name)}_custom_background_args', array(
        'default-color' => 'ffffff',
        'default-image' => '',
    )));
    add_theme_support('customize-selective-refresh-widgets');
}
add_action('after_setup_theme', '${this.camelToKebab(project.name)}_setup');

function ${this.camelToKebab(project.name)}_content_width() {
    $GLOBALS['content_width'] = apply_filters('${this.camelToKebab(project.name)}_content_width', 1200);
}
add_action('after_setup_theme', '${this.camelToKebab(project.name)}_content_width', 0);

function ${this.camelToKebab(project.name)}_scripts() {
    wp_enqueue_style('${this.camelToKebab(project.name)}-style', get_stylesheet_uri(), array(), _S_VERSION);
    wp_enqueue_style('${this.camelToKebab(project.name)}-main-style', get_template_directory_uri() . '/assets/css/style.css', array(), _S_VERSION);
    wp_enqueue_script('${this.camelToKebab(project.name)}-main', get_template_directory_uri() . '/assets/js/main.js', array(), _S_VERSION, true);
}
add_action('wp_enqueue_scripts', '${this.camelToKebab(project.name)}_scripts');

require get_template_directory() . '/inc/custom-header.php';
require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/customizer.php';`;
  }

  private generateIndexPhp(project: Project): string {
    return `<?php
/**
 * The main template file
 *
 * @package ${project.name}
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php
    while (have_posts()) :
        the_post();
        get_template_part('template-parts/content', get_post_type());
    endwhile;
    ?>
</main>

<?php
get_sidebar();
get_footer();`;
  }

  private generateHeaderPhp(project: Project): string {
    return `<?php
/**
 * The header for our theme
 *
 * @package ${project.name}
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', '${this.camelToKebab(project.name)}'); ?></a>

    <header id="masthead" class="site-header">
        <div class="site-branding">
            <?php
            if (has_custom_logo()) :
                the_custom_logo();
            else :
                ?>
                <h1 class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>" rel="home"><?php bloginfo('name'); ?></a></h1>
                <?php
            endif;
            ?>
        </div>

        <nav id="site-navigation" class="main-navigation">
            <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e('Menu', '${this.camelToKebab(project.name)}'); ?></button>
            <?php
            wp_nav_menu(
                array(
                    'theme_location' => 'menu-1',
                    'menu_id' => 'primary-menu',
                )
            );
            ?>
        </nav>
    </header>`;
  }

  private generateFooterPhp(project: Project): string {
    return `<footer id="colophon" class="site-footer">
    <div class="site-info">
        <a href="<?php echo esc_url(__('https://wordpress.org/', '${this.camelToKebab(project.name)}')); ?>">
            <?php
            printf(
                esc_html__('Proudly powered by %s', '${this.camelToKebab(project.name)}'),
                'WordPress'
            );
            ?>
        </a>
        <span class="sep"> | </span>
        <?php
        printf(
            esc_html__('Theme: %1$s by %2$s.', '${this.camelToKebab(project.name)}'),
            '${project.name}',
            '${project.metadata.customData?.author || 'Anonymous'}'
        );
        ?>
    </div>
</footer>
</div>

<?php wp_footer(); ?>

</body>
</html>`;
  }

  private generateFrontPagePhp(project: Project, context: ExportContext): string {
    const homePage = project.pages.find((p) => p.slug === 'home');
    if (!homePage) {
      return `<?php
/**
 * The front page template file
 *
 * @package ${project.name}
 */

get_header();
?>
<main id="primary" class="site-main">
    <p>No front page content configured.</p>
</main>
<?php
get_footer();`;
    }

    return `<?php
/**
 * The front page template file
 *
 * @package ${project.name}
 */

get_header();
?>
<main id="primary" class="site-main page page-${homePage.id}">
    ${this.generatePageComponents(homePage, context)}
</main>
<?php
get_footer();`;
  }

  private generatePageTemplate(page: Page, context: ExportContext): string {
    return `<?php
/**
 * Template Name: ${page.name}
 *
 * @package ${project.name}
 */

get_header();
?>
<main id="primary" class="site-main page page-${page.id}">
    ${this.generatePageComponents(page, context)}
</main>
<?php
get_footer();`;
  }

  private generatePageComponents(page: Page, context: ExportContext): string {
    return page.components.map((comp) => this.generateComponentPhp(comp)).join('\n    ');
  }

  private generateComponentPhp(component: ComponentNode): string {
    const styles = this.generateInlineStyles(component.styles);
    const responsiveStyles = this.generateResponsiveStyles(component, {} as any);
    const children = component.children
      .map((child) => this.generateComponentPhp(child))
      .join('\n        ');

    return `<div id="${component.id}" class="component component-${component.type}" style="${styles}">
        ${children}
    </div>
    ${responsiveStyles}`;
  }

  private generateComponentsPhp(project: Project, context: ExportContext): string {
    const components = project.pages.flatMap((page) => page.components);
    return `<?php
/**
 * Component templates
 *
 * @package ${project.name}
 */

${components.map((comp) => this.generateComponentPhp(comp)).join('\n\n')}`;
  }

  private generateMainCss(project: Project, context: ExportContext): string {
    const themeStyles = this.generateThemeStyles(project.theme);
    const componentStyles = this.generateComponentStyles(project, context);

    return `/**
 * Main stylesheet
 *
 * @package ${project.name}
 */

${themeStyles}

/* Component Styles */
${componentStyles}`;
  }

  private generateMainJs(project: Project): string {
    return `/**
 * Main JavaScript file
 *
 * @package ${project.name}
 */

(function() {
    'use strict';

    // Initialize theme
    function initTheme() {
        console.log('${project.name} theme initialized');
    }

    // Run on DOM ready
    document.addEventListener('DOMContentLoaded', initTheme);
})();`;
  }

  private generateScreenshotPlaceholder(): string {
    return '/* This is a placeholder for the theme screenshot. Replace with an actual 1200x900 PNG image. */';
  }
}
