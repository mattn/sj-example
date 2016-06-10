customElements.define('x-books', class extends sj.Element {
  template() {
    return `
      <h3>Books</h3>
      <input type="text" class="books-filter" sj-model="filter" sj-keyup="keyup()" placeholder="検索するキーワードを入力して下さい" />
      <input type="button" sj-disabled="disabled(filter)" sj-click="clear()" value="クリア" />
      <div class="books-container">
        <div sj-repeat="x in books">
          <div class="item" sj-if="matched(x,filter)" sj-model="x.name" sj-click="clicked($index)">replace here</div>
        </div>
      </div>
    `;
  }

  initialize() {
    this.scope.filter = '';
    this.scope.books = [];
    this.scope.keyup = function() {
      this.scope.filter = this.querySelector('input').value;
      this.update();
    };
    this.scope.clear = function() {
      this.querySelector('input').value = '';
      this.scope.filter = '';
      this.update();
    };
    this.scope.clicked = function(index) {
      location.href = 'http://www.amazon.co.jp/gp/search/?field-keywords=' + encodeURIComponent(this.scope.books[index].name);
    };
    this.scope.disabled = function(x) {
      return x == "";
    };
    this.scope.matched = function(x,filter) {
      return filter == '' || !x || x.name.toLowerCase().indexOf(filter.toLowerCase()) != -1;
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
