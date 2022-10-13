// eslint-disable-next-line func-names
(function () {
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const p = new URLSearchParams(window.location.search);
  p.append('page', '1');

  async function getPosts(page) {
    const response = await fetch(`https://gorest.co.in/public/v2/posts?page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: 'a55241c491f10f171829b2e25011e71da6659e8958874013a254e64221551f98',
      },
    });
    return response.json();
  }

  async function openPost() {
    const postPage = new URLSearchParams(window.location.search);
    const responsePost = await fetch(`https://gorest.co.in/public/v2/posts/${postPage.get('page_id')}`, {
      method: 'GET',
      headers: {
        Authorization: 'a55241c491f10f171829b2e25011e71da6659e8958874013a254e64221551f98',
      },
    });
    const responseComment = await fetch(`https://gorest.co.in/public/v2/comments?post_id=${postPage.get('page_id')}`, {
      method: 'GET',
      headers: {
        Authorization: 'a55241c491f10f171829b2e25011e71da6659e8958874013a254e64221551f98',
      },
    });
    const resultPost = await responsePost.json();
    const resultComment = await responseComment.json();
    const postTitle = document.getElementById('post-title');
    const postText = document.getElementById('post-text');
    const postContainer = document.getElementById('comments');
    postTitle.textContent = resultPost.title;
    postText.textContent = resultPost.body;
    for (const commentContent of resultComment) {
      const commentContainer = document.createElement('div');
      commentContainer.classList.add('comment-container');
      const commentBody = document.createElement('p');
      const commentName = document.createElement('span');
      commentBody.textContent = commentContent.body;
      commentName.textContent = commentContent.name;
      commentContainer.append(commentName, commentBody);
      postContainer.appendChild(commentContainer);
    }
  }

  async function createTable(page = 1) {
    if (page >= 1) await p.set('page', `${page}`);

    const tableContainer = document.getElementById('container-table');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const th = document.createElement('th');
    const tbody = document.createElement('tbody');

    table.classList.add('table', 'table-hover');
    th.textContent = 'blog titles:';
    th.style.textAlign = 'center';

    thead.append(th);
    table.append(thead);

    const posts = await getPosts(page);

    for (const post of posts) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      const link = document.createElement('a');
      link.classList.add('link');
      link.setAttribute('href', `post.html?page_id=${post.id}`);
      link.textContent = post.title;
      // link.addEventListener('click', openPost(post.id));
      td.style.textAlign = 'center';

      td.append(link);
      tr.append(td);
      tbody.append(tr);
    }
    table.append(tbody);
    tableContainer.append(table);
    document.body.append(tableContainer);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', async () => {
      await createTable(Number(p.get('page')) + 1);
    });
    prevBtn.addEventListener('click', async () => {
      await createTable(Number(p.get('page')) - 1);
    });
  }
  window.createTable = createTable;
  window.openPost = openPost;
}());
