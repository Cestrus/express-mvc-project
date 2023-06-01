const deleteHandler = (btn) => {
    const prodId = btn.parentNode.querySelector("[name=id]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest("article");

    fetch(`/admin/product/${prodId}`, {
        method: "DELETE",
        headers: {
            "csrf-token": csrf,
        },
    })
        .then((result) => {
            result.json();
        })
        .then((deta) => {
            productElement.remove();
        })
        .catch((err) => {
            console.log(err);
        });
};
