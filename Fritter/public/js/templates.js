(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h2 id=\"user-info\">Signed in as "
    + container.escapeExpression(((helper = (helper = helpers.currentUser || (depth0 != null ? depth0.currentUser : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"currentUser","hash":{},"data":data}) : helper)))
    + ". </h2>\n<a id=\"logout-button\" href=\"#\" class=\"header-button\">Log out</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "<button id=\"show-login\" class=\"header-button button button-light\">Log in</button>\n<button id=\"show-register\" class=\"header-button button button-light\">Register</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<h1 id=\"title\">fritter</h1>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.currentUser : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['home'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "      <h2>"
    + container.escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"user","hash":{},"data":data}) : helper)))
    + "</h2> \n      Follows:"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.follows : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<br>\n      <button class=\"button button-sm\" id=\"go-home\">back</button>\n      "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.canFollow : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression(container.lambda(depth0, depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<button class=\"button button-sm\" user="
    + container.escapeExpression(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"user","hash":{},"data":data}) : helper)))
    + " id=\"follow-user\">follow</button>";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "      "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.filteredView : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.currentUser : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div id=\"note-error\" class=\"error\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.notLoggedIn : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </div>\n    </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "<button class=\"button button-sm\" id=\"go-home\">back</button>";
},"9":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"new-note-box\">\n        <form id=\"note-form\">\n          <input id=\"note-input\" class=\"input\" type=\"text\" maxlength=\"160\">\n          <button id=\"note-button\" class=\"button search-row-button\" type=\"submit\">Publish!</button>\n          <button id=\"view-follows\" class=\"button search-row-button\">Filter Follows</button>\n        </form>\n      </div>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "          Log in or register to view notes!\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "        <div id="
    + alias2(alias1((depth0 != null ? depth0._id : depth0), depth0))
    + " class=\"note-box\">\n          "
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.ownership : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(16, data, 0),"data":data})) != null ? stack1 : "")
    + "          <b><a href=\"#\" class=\"note-user\" user="
    + alias2(alias1((depth0 != null ? depth0.author : depth0), depth0))
    + ">@"
    + alias2(alias1((depth0 != null ? depth0.author : depth0), depth0))
    + " </a></b>\n          "
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.isRefreet : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n          <em class=\"note-time\">("
    + alias2(alias1((depth0 != null ? depth0.ts : depth0), depth0))
    + ")</em> - <p class=\"note-text\">"
    + alias2(alias1((depth0 != null ? depth0.text : depth0), depth0))
    + "</p>\n        </div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "<button note="
    + container.escapeExpression(container.lambda((depth0 != null ? depth0._id : depth0), depth0))
    + " class=\"delete-button no-border\">X</button>\n          ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isRefreet : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"17":function(container,depth0,helpers,partials,data) {
    return " ";
},"19":function(container,depth0,helpers,partials,data) {
    return "<button note="
    + container.escapeExpression(container.lambda((depth0 != null ? depth0._id : depth0), depth0))
    + " class=\"rf-button\">RF</button>";
},"21":function(container,depth0,helpers,partials,data) {
    return " refreeted "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.originalAuthor : depth0), depth0))
    + " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div id=\"home\">\n  <div id=\"user\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "    <div id=\"note-container\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.notes : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true});
templates['login'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "<form id=\"register-form\">\n    <h3>Register</h3>\n    <input name=\"username\" type=\"text\" class=\"form-ele input\" placeholder=\"username\">\n    <input name=\"password\" type=\"password\" class=\"form-ele input\" placeholder=\"password\">\n    <button id=\"register-button\" class=\"form-ele button\">Register</button>\n</form>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "<form id=\"login-form\">\n    <h3>Log in</h3>\n    <input name=\"username\" type=\"text\" class=\"form-ele input\" placeholder=\"username\">\n    <input name=\"password\" type=\"password\" class=\"form-ele input\" placeholder=\"password\">\n    <button id=\"login-button\" class=\"form-ele button\">Login</button>\n</form>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<button id=\"close-popup\" class=\"no-border\">X</button>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.register : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "<div id=\"login-error\" class=\"error\"></div>";
},"useData":true});
})();
