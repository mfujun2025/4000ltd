/* 靓号库筛选与渲染 */
(function () {
  var all = window.__NUMBERS__ || [];
  var state = { cat: 'all', level: 'all', sort: 'level', kw: '' };

  var LEVEL_NAME = { A: 'A级稀缺', B: 'B级优选', C: 'C级实惠' };
  var LEVEL_CLS = { A: 'tag-a', B: 'tag-b', C: 'tag-c' };

  function fmtPrice(p) {
    return '¥' + p.toLocaleString('zh-CN');
  }

  /* 价格展示：优先用飞书原始套餐文本（如 6000/3年），否则回退到数字 */
  function priceLabel(n) {
    if (n.priceText) return n.priceText.indexOf('元') === -1
      ? n.priceText.replace(/^(\d+)/, '¥$1')
      : '¥' + n.priceText;
    return fmtPrice(n.price || 0);
  }

  function levelWeight(l) {
    return { A: 3, B: 2, C: 1 }[l] || 0;
  }

  function apply() {
    var list = all.filter(function (n) {
      if (state.cat !== 'all' && n.cat !== state.cat) return false;
      if (state.level !== 'all' && n.level !== state.level) return false;
      if (state.kw) {
        var k = state.kw.replace(/\D/g, '');
        var plain = n.num.replace(/[^\d]/g, '');
        if (k && plain.indexOf(k) === -1) return false;
      }
      return true;
    });

    if (state.sort === 'level') {
      list.sort(function (a, b) {
        var d = levelWeight(b.level) - levelWeight(a.level);
        return d !== 0 ? d : b.price - a.price;
      });
    } else if (state.sort === 'price-desc') {
      list.sort(function (a, b) { return b.price - a.price; });
    } else {
      list.sort(function (a, b) { return a.price - b.price; });
    }
    return list;
  }

  function render() {
    var grid = document.getElementById('numGrid');
    var cnt = document.getElementById('cnt');
    var list = apply();
    cnt.textContent = list.length;

    if (!list.length) {
      grid.innerHTML = '<div class="empty-tip">😕 没有匹配的靓号<br>换个筛选条件，或直接微信咨询人工推荐</div>';
      return;
    }

    grid.innerHTML = list.map(function (n) {
      var parts = n.num.split('-');
      var disp = parts[0] + '<span class="sep">-</span>' + parts[1] + '<span class="sep">-</span>' + parts[2];
      var segTag = n.seg ? '<span class="tag tag-d">' + n.seg + ' 号段</span>' : '<span class="tag tag-d">' + n.cat + '</span>';
      return '<div class="num-card">' +
        '<div class="num">' + disp + '</div>' +
        '<div class="meta">' +
          '<span class="tag ' + (LEVEL_CLS[n.level] || 'tag-plain') + '">' + (LEVEL_NAME[n.level] || n.level) + '</span>' +
          segTag +
          '<span class="tag tag-plain">' + n.cat + '</span>' +
        '</div>' +
        '<div class="row"><span>' + n.feat.slice(0, 14) + '</span></div>' +
        '<div class="row" style="margin-top:4px"><span>套餐价格</span><span class="cost">' + priceLabel(n) + '</span></div>' +
        '<button class="btn btn-primary" onclick="askNum(\'' + n.num + '\')">咨询此号码</button>' +
      '</div>';
    }).join('');
  }

  window.askNum = function (num) {
    if (typeof showWx === 'function') showWx();
    if (typeof toast === 'function') toast('请添加微信咨询号码：' + num);
  };

  window.doSearch = function () {
    state.kw = document.getElementById('numSearch').value;
    render();
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('numSearch').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    });

    document.querySelectorAll('.chip[data-cat]').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.chip[data-cat]').forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        state.cat = c.dataset.cat;
        render();
      });
    });
    document.querySelectorAll('.chip[data-level]').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.chip[data-level]').forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        state.level = c.dataset.level;
        render();
      });
    });
    document.querySelectorAll('.chip[data-sort]').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.chip[data-sort]').forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        state.sort = c.dataset.sort;
        render();
      });
    });

    render();
  });
})();
