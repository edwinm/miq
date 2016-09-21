require(['../node_modules/qunitjs/qunit/qunit', '../miq', '../node_modules/native-promise-only/lib/npo.src'], function(QUnit, miq, npo) {

	miq(function() {
		QUnit.start();

		QUnit.test("version", function (assert) {
			assert.ok(/[0-9]+\.[0-9]+\.[0-9]+/.test(miq.miq));
		});

        QUnit.test("initialise", function (assert) {
            var domElement = document.createElement('div');
            domElement.className = 'test1';
            var miqElement = miq(domElement);
            assert.ok(miqElement.hasClass('test1'));
            var miqElement2 = miq(miqElement);
            assert.ok(miqElement2.hasClass('test1'));
        });

        QUnit.test("second argument", function (assert) {
            miq('body').append(miq('<section>'));
            assert.equal(miq('section').length, 2);
            assert.equal(miq('section', document.querySelector('.miq')).length, 1);
            assert.equal(miq('section', miq('.miq')).length, 1);
        });

        QUnit.test("fragment", function (assert) {
			var fragment = miq();
			fragment.append(miq('<div>').addClass('child1'));
			miq('.miq').append(fragment);
			assert.ok(miq(miq('.miq').first.lastChild).hasClass('child1'));
            miq('.miq').append(miq('<div>').addClass('child2').first);
            assert.ok(miq(miq('.miq').first.lastChild).hasClass('child2'));
			miq('.child1, .child2').remove();
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
			assert.ok(miq('ul li').eq(2).text() == 'javascript');
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
			select.find('option').eq(1).val(true);
			assert.ok(select.val() == 1);
			assert.ok(select.find('option').eq(1).val() === true);
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

		QUnit.test("css", function (assert) {
			var p = miq('.miq p:first-child');
			p.css('color', 'red');
			assert.ok(p.css('color') == 'red');
		});

		QUnit.test("append/remove", function (assert) {
			var div = miq('<div>');
			miq('.miq').append(div);
			assert.ok(miq('.miq div').length == 1);
			div.remove();
			assert.ok(miq('.miq div').length == 0);
		});

		QUnit.test("before", function (assert) {
			miq('.miq').before(miq('<div>').addClass('before').text('Before'));
			assert.ok(miq(miq('.before').first.nextSibling).hasClass('miq'));
			miq('.before').remove();
		});

		QUnit.test("parent", function (assert) {
			assert.ok(miq('.miq p').parent().prop('tagName') == 'SECTION');
		});

		QUnit.test("clone", function (assert) {
			var section = miq('.miq section');
			miq('.miq').append(section.clone());
			miq('.miq').append(section.clone());
			assert.ok(miq('.miq p').length == 3);
			miq('.miq section').eq(2).remove();
			miq('.miq section').eq(1).remove();
		});

		QUnit.test("closest", function (assert) {
			var p = miq('section p:first-child');
			assert.ok(p.closest('div').hasClass('miq'));
		});

		QUnit.test("is (matches)", function (assert) {
			miq('section p:first-child').addClass('first');
			var first = miq('section p').is('.first');
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
			miq.ajax('ajax/test.json', {dataType: 'json'}).then(function (data) {
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
			miq.ajax('ajax/test.xml', {dataType: 'xml'}).then(function (data) {
				assert.ok(miq('test test1-1', data).text() == 'test1');
				done();
			});
		});

		QUnit.test("plugin", function (assert) {
			miq.fn.rect = function() {
				return this.first.getBoundingClientRect();
			};
			assert.ok('top' in miq('.miq').rect());
		});
	});
});
