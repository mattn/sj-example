customElements.define('sj-books', class extends sj.Element {
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
    scope.keyup = (e) => {
      scope.filter = e.target.value;
      this.update();
    };
    scope.clear = () => {
      scope.filter = '';
      this.update();
    };
    scope.clicked = (index) => {
      const URI = 'http://www.amazon.co.jp/gp/search/';
      location.href = URI + `?field-keywords=${encodeURIComponent(scope.books[index].name)}`;
    };
    scope.matched = (x,filter) => filter == '' || x.name.toLowerCase().indexOf(filter.toLowerCase()) != -1;
  }

  setBooks(books) {
    this.scope.books = books;
    this.update();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  var elems = document.getElementsByTagName('sj-books');
  for (var n = 0; n < elems.length; n++) {
    ((elem) => {
      var ep = elem.getAttribute('endpoint') || '/query';
      fetch(ep)
        .then((response) => {
          return response.json()
        }).then((json) => {
          elem.setBooks(json);
        });
    })(elems[n]);
  }
}, false);
