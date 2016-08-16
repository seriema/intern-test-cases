define([
	'require',
	'intern!object',
	'intern/chai!assert',
	'intern/dojo/node!leadfoot/keys'
], function (
	require,
	registerSuite,
	assert,
	keys
) {
	registerSuite({
		name: 'hello',

		'check contents': function () {
			// Functional tests should return a command chain based on the remote object
			return this.remote
				// Use require.toUrl to get a relative URL to a resource
				.get(require.toUrl('./page.html'))

				.findByClassName('bar')
				.pressKeys(keys.CONTROL)
				.click()
				.pressKeys(keys.NULL)
				.end()

				.findByClassName('bar')
				.getVisibleText()
				.then(function (text) {
					assert.strictEqual(text, 'true');
				});
		}
	});
});
