customElements.define('x-books', class extends sj.Element {
  template() {
    return `
      <h3>Books</h3>
      <input type="text" class="books-filter" sj-model="filter" sj-keyup="keyup($event)" placeholder="検索するキーワードを入力して下さい" />
      <input type="button" sj-disabled="!filter" sj-click="clear()" value="クリア" />
      <div class="books-container">
        <div sj-repeat="x in books">
          <div class="item" sj-if="matched(x,filter)" sj-model="x.name" sj-click="clicked($index)">replace here</div>
        </div>
      </div>
    `;
  }

  initialize() {
    var scope = this.scope;
    scope.filter = '';
    scope.books = [];
    scope.keyup = function(e) {
      scope.filter = e.target.value;
      this.update();
    };
    scope.clear = function() {
      scope.filter = '';
      this.update();
    };
    scope.clicked = function(index) {
      const URI = 'http://www.amazon.co.jp/gp/search/';
      location.href = URI + `?field-keywords=${encodeURIComponent(scope.books[index].name)}`;
    };
    scope.matched = function(x,filter) {
      return filter == '' || x.name.toLowerCase().indexOf(filter.toLowerCase()) != -1;
    };
  }

  setBooks(books) {
    this.scope.books = books;
    this.update();
  }
});

window.addEventListener("DOMContentLoaded", function(){
  var elems = document.getElementsByTagName('x-books');
  for (var n = 0; n < elems.length; n++) {
    (function(elem) {
      var ep = elem.getAttribute('endpoint') || '/query';
      fetch(ep)
        .then(function(response) {
          return response.json()
        }).then(function(json) {
          elem.setBooks(json);
        });
    })(elems[n]);
  }
}, false);
