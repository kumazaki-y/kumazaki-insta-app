import axios from 'axios';
import $ from 'jquery';

document.addEventListener('DOMContentLoaded', function() {
    // クラスの存在を確認
    if ($('.new_comment').length > 0) {
        const commentForm = $('.new_comment');
        const showCommentFormBtn = $('#show_comment_form_btn');
        const dataset = commentForm.data();
        const articleId = dataset.articleId;

        // コメントフォームを表示するボタンのクリックイベント
        showCommentFormBtn.on('click', function() {
            commentForm.css('display', 'block');
            showCommentFormBtn.css('display', 'none'); // ボタンを非表示
        });

        // ページ読み込み時にコメントを非同期で取得
        axios.get(`/articles/${articleId}/comments`)
        .then(function(response) {
            const comments = response.data;
            comments.forEach(comment => {
                $('.comments').append(`
                    <div class="comment">
                        <div class="comment-header">
                            <img src="${comment.user_profile_image}" alt="${comment.user_username}" class="profile-img">
                        </div>
                        <div class="comment-content">
                            <strong>${comment.user_username}</strong>
                            <p>${comment.content}</p>
                        </div>
                    </div>
                `);
            });
        })
        .catch(function(error) {
            console.log("コメントの取得に失敗しました:", error);
        });

        // コメントフォームの送信イベント
        $('#comment_form').on('submit', function(e) {
            e.preventDefault();
            const commentContent = $('textarea[name="comment[content]"]').val();
            const submitButton = $(this).find('button[type="submit"]');

            axios.post(`/articles/${articleId}/comments`, {
                comment: {
                    content: commentContent
                }
            })
            .then(function(response) {
                const comment = response.data;
                $('.comments').prepend(`
                    <div class="comment">
                        <div class="comment-header">
                            <img src="${comment.user_profile_image}" alt="${comment.user_username}" class="profile-img">
                        </div>
                        <div class="comment-content">
                            <strong>${comment.user_username}</strong>
                            <p>${comment.content}</p>
                        </div>
                    </div>
                `);
                $('textarea[name="comment[content]"]').val(''); // 入力欄をクリア
                commentForm.css('display', 'none'); // フォームを隠す
                showCommentFormBtn.css('display', 'block'); // ボタンを再表示
            })
            .catch(function(error) {
                // エラー処理
                if (error.response && error.response.data && error.response.data.errors) {
                    alert(error.response.data.errors.join("\n"));
                } else {
                    alert("コメントの投稿に失敗しました");
                }
            })
            .finally(function() {
                // 最終処理（成功・失敗に関わらず実行される）
                // コメント投稿ボタンを再度有効化
                submitButton.prop('disabled', false);
            });
        });
    }
});
