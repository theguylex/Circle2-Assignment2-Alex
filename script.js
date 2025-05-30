document.addEventListener("DOMContentLoaded", () => {
  // Initial Data
  const cardsData = [
    {
      title: "Val Thorens",
      image: "./assets/Image-1.png",
      liked: false,
    },
    {
      title: "Restaurant terrace",
      image: "./assets/Image-2.png",
      liked: false,
    },
    {
      title: "An outdoor cafe",
      image: "./assets/Image-3.png",
      liked: false,
    },
    {
      title: "A very long bridge, over the forest...",
      image: "./assets/Image-4.png",
      liked: false,
    },
    {
      title: "Tunnel with morning light",
      image: "./assets/Image-5.png",
      liked: false,
    },
    {
      title: "Mountain house",
      image: "./assets/Image-6.png",
      liked: false,
    },
  ];

  const gallerySection = document.querySelector(".gallery");

  // Modal Setup
  const body = document.querySelector("body");

  const createModal = (contentHTML, onClose = null) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-content">
        ${contentHTML}
        <button class="modal-close">&times;</button>
      </div>
    `;
    body.appendChild(overlay);

    const close = () => {
      overlay.remove();
      if (typeof onClose === "function") onClose();
    };

    overlay.querySelector(".modal-close").onclick = close;
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") close();
      },
      { once: true }
    );

    return overlay;
  };

  // Render Cards
  const renderCards = () => {
    gallerySection.innerHTML = "";
    cardsData.forEach((card, index) => {
      const article = document.createElement("article");
      article.className = "gallery-item";
      article.innerHTML = `
        <img src="${card.image}" alt="${card.title}" />
        <footer class="card-footer">
          <span>${card.title}</span>
          <i class="fa-heart ${card.liked ? "fa-solid" : "fa-regular"}"></i>
        </footer>
      `;
      // Like toggle
      const heartIcon = article.querySelector(".fa-heart");
      heartIcon.onclick = () => {
        card.liked = !card.liked;
        heartIcon.classList.toggle("fa-solid");
        heartIcon.classList.toggle("fa-regular");
      };

      // Preview image
      const img = article.querySelector("img");
      img.onclick = () => {
        createModal(`
          <img src="${card.image}" style="width: 100%; max-width: 500px; border-radius: 12px;" />
          <h3 style="text-align: center; margin-top: 10px;">${card.title}</h3>
        `);
      };

      gallerySection.appendChild(article);
    });

    // Autofocus first card
    const firstCard = gallerySection.querySelector(".gallery-item img");
    if (firstCard) firstCard.setAttribute("tabindex", "0");
  };

  renderCards();

  // Edit Profile Modal
  const editBtn = document.querySelector(".edit-profile a");
  editBtn.addEventListener("click", () => {
    const nameElem = document.querySelector(".profile-details h2");
    const descElem = document.querySelector(".profile-details p");
    const imgElem = document.querySelector(".img-details img");

    const modal = createModal(`
      <h2>Edit Profile</h2>
      <form id="edit-profile-form">
        <input type="text" id="profile-name" placeholder="Name" value="${nameElem.textContent}" required minlength="2" maxlength="50" />
        <textarea id="profile-desc" placeholder="Description" required minlength="5" maxlength="160">${descElem.textContent}</textarea>
        <input type="file" id="profile-img" accept="image/*" />
        <button type="submit">Save</button>
      </form>
    `);

    modal.querySelector("#edit-profile-form").onsubmit = (e) => {
      e.preventDefault();
      const name = modal.querySelector("#profile-name").value.trim();
      const desc = modal.querySelector("#profile-desc").value.trim();
      const file = modal.querySelector("#profile-img").files[0];

      nameElem.textContent = name;
      descElem.textContent = desc;
       if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imgElem.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      modal.remove();
    };
  });

  // New Post Modal
  const newPostBtn = document.querySelector(".new-post button");
  newPostBtn.addEventListener("click", () => {
    const modal = createModal(`
      <h2>New Post</h2>
      <form id="new-post-form">
        <input type="text" id="post-title" placeholder="Title" required minlength="2" maxlength="100" />
        <input type="file" id="post-img" accept="image/*" required />
        <button type="submit" disabled>Create</button>
      </form>
    `);

    const form = modal.querySelector("#new-post-form");
    const titleInput = modal.querySelector("#post-title");
    const imgInput = modal.querySelector("#post-img");
    const submitBtn = form.querySelector("button");

    const validate = () => {
      const titleValid = titleInput.value.trim().length >= 2;
      const fileValid = imgInput.files.length > 0;
      submitBtn.disabled = !(titleValid && fileValid);
    };

     titleInput.addEventListener("input", validate);
    imgInput.addEventListener("change", validate);

    form.onsubmit = (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const file = imgInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        cardsData.unshift({
          title,
          image: e.target.result,
          liked: false,
        });
        renderCards();
        modal.remove();
      };
      reader.readAsDataURL(file);
    };
  });



  // Styles for modals
  const modalStyle = document.createElement("style");
  modalStyle.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      position: relative;
    }
    .modal-content form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .modal-content input[type="text"],
    .modal-content textarea {
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .modal-content button {
      background: black;
      color: white;
      padding: 10px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background .3s ease;
    }
    .modal-content button[disabled] {
      background: #aaa;
      cursor: not-allowed;
    }
    .modal-close {
      position: absolute;
      top: 10px; right: 10px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(modalStyle);
});
