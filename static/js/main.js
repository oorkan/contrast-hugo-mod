((dom, bom, body) => {
  let post_share_btn = dom.querySelector('.post-share-btn');
  let post_title = dom.querySelector('title');
  let post_description = dom.querySelector('meta[name=\'description\']');
  let post_url = dom.querySelector('link[rel=\'canonical\']');
  let modal_content = `
    <div class='modal'>
      <div class='modal-inner'>
        <h2>${post_title.innerText}</h2>  
        <p>${post_description.getAttribute('content')}</p>
        <div class='social-share'>
          <p style='margin-bottom: 0px;'><strong><small>Share</small></strong></p>
          <ul>
            <li><a href='https://twitter.com/intent/tweet?url=${encodeURIComponent(post_url.href)}&text=${encodeURIComponent(post_description.getAttribute('content'))}' target='_blank' rel='noopener noreferrer' title='Share on Twitter' class='share-btn social-logo-32 social-logo-twitter'>Share on Twitter</a></li>
            <li><a href='https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post_url.href)}' target='_blank' rel='noopener noreferrer' title='Share on Facebook' class='share-btn social-logo-32 social-logo-facebook'>Share on Facebook</a></li>
            <li><a href='mailto:?subject${encodeURIComponent(post_title.innerText)}=&body=${encodeURIComponent(post_description.getAttribute('content'))}' class='share-btn social-logo-32 social-logo-email'>Share via Email</a></li>
          </ul>  
          <input type='url' readonly='readonly' value='${post_url.href}' onfocus='this.select();'/>
        </div>
      </div>
    </div>
  `;

  post_share_btn.addEventListener('click', () => {
    body.insertAdjacentHTML('afterbegin', modal_content);
  });
})(document, window, document.body);