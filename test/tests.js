miq(function() {

	test( "version", function() {
		ok(/[0-9]+\.[0-9]+\.[0-9]+/.test(miq().miq));
	});

	test( "add/remove/hasClass", function() {
		var newDiv = miq('<div>');
		newDiv.addClass('test1');
		ok( newDiv.hasClass('test1') );
		newDiv.removeClass('test1');
		ok( !newDiv.hasClass('test1') );
	});

	test( "build html", function() {
		var a = ['html', 'css', 'javascript'];
		var ul = miq('<ul>');
		ul.append(a.map(function(el) {
			console.log('el', el);
			return miq('<li>').html(el);
		}));
		miq('.miq').append(ul);
		ok( miq('ul li').length == 3 );
		console.log('txt', miq('ul li').get(2).text());
		ok( miq('ul li').get(2).text() == 'javascript' );
	});

	test( "html/text", function() {
		var div = miq('<div>');
		div.html('<p>test</p>');
		ok( div.find('p').length == 1 );
		ok( div.html() == '<p>test</p>' );
		div.text('<p>test</p>');
		ok( div.find('p').length == 0 );
		ok( div.text() == '<p>test</p>' );
	});

	test( "properties", function() {
		var first = miq('<div>');
		first.prop('innerText', 'HTML');
		ok( first.prop('innerText') == 'HTML' );
		first.attr('data-test', 'Test1');
		ok( first.attr('data-test') == 'Test1' );
		first.removeAttr('data-test');
		ok( first.attr('data-test') === null );
	});

	test( "val", function() {
		var input = miq('<input>');
		input.val(1234);
		ok( input.val() == 1234 );
	});

	test( "css", function() {
		var p = miq('.miq p:first-child');
		p.css('color', 'red');
		ok( p.css('color') == 'red' );
	});

	test( "remove", function() {
		var div = miq('<div>');
		miq('.miq').append(div);
		ok ( miq('.miq div').length == 1 );
		div.remove();
		ok ( miq('.miq div').length == 0 );
	});

	test( "closest", function() {
		var p = miq('section p:first-child');
		ok( p.closest('div').hasClass('miq') );
	});

	test( "matches", function() {
		miq('section p:first-child').addClass('first');
		var first = miq('section p').matches('.first');
		ok( first.length == 1);
		ok( first.hasClass('first') );
	});

	test( "find", function() {
		ok( miq('.miq').find('li').length == 3 );
	});

	test( "remove all", function() {
		miq('.miq ul').remove();
		ok( miq('.miq ul').length == 0 );
	});
});


