customElements.define('sj-books', class extends sj.Element {
  template() {
    return `
      <h3>Books</h3>
      <input type="text" sj-model="this.filter" placeholder="検索するキーワードを入力して下さい" class="books-filter" />
      <input type="button" sj-disabled="!!!this.filter" sj-click="this.clear()" value="クリア" />
      <div class="books-container">
        <div sj-repeat="x in this.books">
          <div class="item" sj-if="this.matched(x,this.filter)" sj-click="this.clicked($index)" sj-bind="x.name">replace me</div>
        </div>
      </div>
    `;
  }

  initialize() {
    this.books = [];
    this.clear = () => {
      this.filter = '';
      this.update();
    };
    this.clicked = (index) => {
      const URI = 'http://www.amazon.co.jp/gp/search/';
      location.href = URI + `?field-keywords=${encodeURIComponent(this.books[index].name)}`;
    };
    this.matched = (x,filter) => !!!filter || x.name.toLowerCase().indexOf(filter.toLowerCase()) != -1;
  }

  get books() {
    return this.b;
  }

  set books(b) {
    this.b = b;
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
          elem.books = json;
        });
    })(elems[n]);
  }
}, false);
