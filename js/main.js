/* 400靓号网 - 前端交互 */

// 微信弹窗
function showWx() {
  document.getElementById('wxPopup').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function hideWx() {
  document.getElementById('wxPopup').classList.remove('show');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') hideWx();
});

// 复制微信号
function copyWx() {
  var el = document.getElementById('wxId');
  if (!el) return;
  var txt = el.textContent.trim();
  var done = function () { toast('微信号已复制：' + txt); };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(txt).then(done).catch(fallback);
  } else { fallback(); }
  function fallback() {
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('请手动复制：' + txt); }
    document.body.removeChild(ta);
  }
}

// 轻提示
function toast(msg) {
  var d = document.createElement('div');
  d.textContent = msg;
  d.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);' +
    'background:rgba(0,0,0,.82);color:#fff;padding:13px 24px;border-radius:8px;' +
    'font-size:15px;z-index:100000;max-width:80vw;text-align:center';
  document.body.appendChild(d);
  setTimeout(function () {
    d.style.transition = 'opacity .3s';
    d.style.opacity = '0';
    setTimeout(function () { document.body.removeChild(d); }, 320);
  }, 1800);
}

// 返回顶部按钮
window.addEventListener('scroll', function () {
  var b = document.querySelector('.back-top');
  if (b) b.classList.toggle('show', window.scrollY > 420);
});

// 申请表单
function submitForm(e) {
  e.preventDefault();
  var f = e.target;
  var name = f.querySelector('[name=name]').value.trim();
  var tel = f.querySelector('[name=tel]').value.trim();
  if (!name) { toast('请填写您的称呼'); return false; }
  if (!/^[\d\-\s]{7,20}$/.test(tel)) { toast('请填写正确的联系电话'); return false; }
  var ok = f.querySelector('.form-ok');
  if (ok) ok.style.display = 'block';
  toast('提交成功！我们会在 10 分钟内与您联系');
  f.reset();
  return false;
}
