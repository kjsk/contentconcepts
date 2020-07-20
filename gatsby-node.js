exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: 'babel-plugin-import',
    options: {
      libraryName: 'antd',
      style: true
    }
  })
}

const path = require('path');

const { createFilePath } = require(`gatsby-source-filesystem`)
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {

  const { createPage } = actions

  const servicesData = graphql(`
    query {
			allMarkdownRemark(
				filter: { fileAbsolutePath: { regex: "/services/" } }
			) {
				edges {
					node {
						fields {
							slug
						}
					}
				}
			}
		}
	`).then(result => {
		if (result.errors) {
			Promise.reject(result.errors);
		}

		// Create services pages
		result.data.allMarkdownRemark.edges.forEach(({ node }) => {
			createPage({
				path: node.fields.slug,
        component: path.resolve(`./src/components/EditingServices/index.js`),
        context: {
          slug: node.fields.slug
        },
			});
		});
  });

  const blogs = graphql(`
    query {
			allMarkdownRemark(
				filter: { fileAbsolutePath: { regex: "/blog/" } }
			) {
				edges {
					node {
						fields {
							slug
						}
					}
				}
			}
		}
	`).then(result => {
		if (result.errors) {
			Promise.reject(result.errors);
		}

		// Create blog pages
		result.data.allMarkdownRemark.edges.forEach(({ node }) => {
			createPage({
				path: node.fields.slug,
        component: path.resolve(`./src/components/Blog/index.js`),
        context: {
          slug: node.fields.slug
        },
			});
		});
  });

  return Promise.all([servicesData, blogs]);

}