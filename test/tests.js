require(['../node_modules/qunitjs/qunit/qunit', '../miq', '../node_modules/es6-promise/dist/es6-promise.min'], function(QUnit, miq, es6Promise) {

	es6Promise.polyfill();

	miq(function() {
		QUnit.start();

		QUnit.test("version", function (assert) {
			assert.ok(/[0-9]+\.[0-9]+\.[0-9]+/.test(miq.miq));
		});

		QUnit.test("add/remove/hasClass", function (assert) {
			var newDiv = miq('<div>');
			newDiv.addClass('test1');
			assert.ok(newDiv.hasClass('test1'));
			newDiv.removeClass('test1');
			assert.ok(!newDiv.hasClass('test1'));
		});

		QUnit.test("build html", function (assert) {
			var a = ['html', 'css', 'javascript'];
			var ul = miq('<ul>');
			ul.append(a.map(function (el) {
				return miq('<li>').html(el);
			}));
			miq('.miq').append(ul);
			assert.ok(miq('ul li').length == 3);
			assert.ok(miq('ul li').get(2).text() == 'javascript');
		});

		QUnit.test("html/text", function (assert) {
			var div = miq('<div>');
			div.html('<p>test</p>');
			assert.ok(div.find('p').length == 1);
			assert.ok(div.html() == '<p>test</p>');
			div.text('<p>test</p>');
			assert.ok(div.find('p').length == 0);
			assert.ok(div.html() == '&lt;p&gt;test&lt;/p&gt;');
			assert.ok(div.text() == '<p>test</p>');
		});

		QUnit.test("properties", function (assert) {
			var first = miq('<div>');
			first.prop('innerText', 'HTML');
			assert.ok(first.prop('innerText') == 'HTML');
			first.attr('data-test', 'Test1');
			assert.ok(first.attr('data-test') == 'Test1');
			first.removeAttr('data-test');
			assert.ok(first.attr('data-test') === null);
		});

		QUnit.test("val", function (assert) {
			var input = miq('<input>');
			input.val(1234);
			assert.ok(input.val() == 1234);

			var select = miq('<select>');
			select.append(['test1', 'test2', 'test3'].map(function(t){return miq('<option>').text(t)}));
			miq('.miq').append(select);
			select.val(2);
			assert.ok(select.val() == 2);
			miq(select.find('option')[1]).val(true);
			assert.ok(select.val() == 1);
			assert.ok(miq(select.find('option')[1]).val() === true);
			select.remove();

			input = miq('<input>').attr('type', 'checkbox');
			assert.ok(input.val() === false);
			input.val(true);
			assert.ok(input.val() === true);

			input = miq('<input>').attr('type', 'radio');
			assert.ok(input.val() === false);
			input.val(true);
			assert.ok(input.val() === true);
		});

		QUnit.test("data", function (assert) {
			var el = miq('.miq');
			el.data('test', {test1: "test1"});
			assert.ok(el.data('test').test1 == 'test1');
		});

		QUnit.test("css", function (assert) {
			var p = miq('.miq p:first-child');
			p.css('color', 'red');
			assert.ok(p.css('color') == 'red');
		});

		QUnit.test("remove", function (assert) {
			var div = miq('<div>');
			miq('.miq').append(div);
			assert.ok(miq('.miq div').length == 1);
			div.remove();
			assert.ok(miq('.miq div').length == 0);
		});

		QUnit.test("closest", function (assert) {
			var p = miq('section p:first-child');
			assert.ok(p.closest('div').hasClass('miq'));
		});

		QUnit.test("matches", function (assert) {
			miq('section p:first-child').addClass('first');
			var first = miq('section p').matches('.first');
			assert.ok(first.length == 1);
			assert.ok(first.hasClass('first'));
		});

		QUnit.test("find", function (assert) {
			assert.ok(miq('.miq').find('li').length == 3);
		});

		QUnit.test("remove all", function (assert) {
			miq('.miq ul').remove();
			assert.ok(miq('.miq ul').length == 0);
		});

		QUnit.test("ajax json", function (assert) {
			var done = assert.async();
			miq.ajax('ajax/test.json', {type: 'json'}).then(function (data) {
				assert.ok(data.test1[0]['test1.1'] == 'test1.1');
				done();
			});
		});

		QUnit.test("ajax text", function (assert) {
			var done = assert.async();
			miq.ajax('ajax/test.txt', {}).then(function (data) {
				assert.ok(data == 'This is a sample test file.\n');
				done();
			});
		});

		QUnit.test("ajax xml", function (assert) {
			var done = assert.async();
			miq.ajax('ajax/test.xml', {type: 'xml'}).then(function (data) {
				assert.ok(miq('test test1-1', data).text() == 'test1');
				done();
			});
		});
	});
});
