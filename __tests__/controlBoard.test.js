
function _replaceHtml(html,data) {
    var name,
        replacedHtml = html;

    for(name in data) {
        replacedHtml = replacedHtml.replace(new RegExp("\{" + name + "\}", 'g'), data[name]);
    }
    return replacedHtml;
}


test('replaceHtml:1', ()=> {

    var html = '<div data-url="{url}"></div><a href="{url}"></a>',
        replacedHtml,
        data = {
            url: "http://www.sina.com"
        },
        okHtml = '<div data-url="http://www.sina.com"></div><a href="http://www.sina.com"></a>';
        replacedHtml = _replaceHtml(html, data);
    expect(replacedHtml).toEqual(okHtml);
});