((dom, bom, body) => {
  const post_share_btn = dom.querySelector('.btn-share');
  
  let post_title = dom.querySelector('title') || false;
  let post_description = dom.querySelector('meta[name=\'description\']') || false;
  let post_url = dom.querySelector('link[rel=\'canonical\']') || false;

  const insertModal = (modal_content, callback) => {
    body.insertAdjacentHTML('afterbegin', modal_content); callback();
    body.classList.add('no-overflow');
  }

  const modalEvents = modal => {
    let modal_inner = modal.querySelector('.modal-inner');

    modal.addEventListener('click', e => {
      if(e.target != modal_inner && !e.target.closest(`.${modal_inner.classList[0]}`)) {
        closeModal(modal);
      }
    });
  }

  const closeModal = modal => {
    let modal_inner = modal.querySelector('.modal-inner');

    modal_inner.classList.add('close');
    modal_inner.addEventListener('animationend', _ => {
      modal.remove(); body.classList.remove('no-overflow');
    });
  };
  
  if(post_title && post_description && post_url) {
    let modal_content = `
      <div class='modal'>
        <button class='btn-modal-close'>×</button>
        <div class='modal-inner'>
          <div class='modal-header'>
            <h3 class='no-spacing'>${post_title.innerText}</h3>  
            <p class='no-spacing'>${post_description.getAttribute('content')}</p>
          </div>
          <div class='modal-footer'>
            <div class='socialShare'>
              <p class='title'><strong><small>Share</small></strong></p>
              <ul class='no-list-style no-spacing'>
                <li><a href='https://twitter.com/intent/tweet?url=${encodeURIComponent(post_url.href)}&text=${encodeURIComponent(post_description.getAttribute('content'))}' target='_blank' rel='noopener noreferrer' title='Share on Twitter' class='btn-share-on social-logo-32 social-logo-twitter'>Share on Twitter</a></li>
                <li><a href='https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post_url.href)}' target='_blank' rel='noopener noreferrer' title='Share on Facebook' class='btn-share-on social-logo-32 social-logo-facebook'>Share on Facebook</a></li>
                <li><a href='mailto:?subject=${encodeURIComponent(post_title.innerText)}=&body=${encodeURIComponent(post_description.getAttribute('content'))}' class='btn-share-on social-logo-32 social-logo-email'>Share via Email</a></li>
              </ul>  
              <input type='url' readonly='readonly' value='${post_url.href}' onfocus='this.select();'/>
            </div>
          </div>
        </div>
      </div>
    `;

    if(post_share_btn) {
      post_share_btn.addEventListener('click', _ => {
        insertModal(modal_content, _ => { modalEvents(dom.querySelector('.modal')) });
      });
    }
  }

})(document, window, document.body);