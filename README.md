# Social Media
## API測試(1)-註冊
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/register
  
  •	Body(x-www-form-urlencoded):  
  
    o name: test
    o password: test 
    o email: test@gmail.com
    
## API測試(2)-登入
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/login
  
  •	Body(x-www-form-urlencoded):
  
    o password: test 
    o email: test@gmail.com
    
  •	於headers中取的token
## API測試(3)-修改
  •	HTTP Method: PUT
  
  •	URL:http://localhost:3000/update_user
  
  •	Headers:
  
    o Content-Type: application/x-www-form-urlencoded
    o token: 貼上登入取得的token
    
  •	Body(x-www-form-urlencoded):
  
    o name: test
    o password: test123
    o email: test@gmail.com
    
 ## API測試(4)-查詢所有使用者
  •	HTTP Method: GET
  
  •	URL:http://localhost:3000/search_user
 
 ## API測試(5)-發送貼文
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/add_article
    
  •	Body(form-data):
  
    o authorID: 發文人的ID
    o title: test
    o name: test
    o category: testing
    o content: test123
  
 ## API測試(6)-更改貼文
  •	HTTP Method: PUT
  
  •	URL:http://localhost:3000/update_article
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    o content: test456
  
  ## API測試(7)-查詢全部貼文
  •	HTTP Method: GET
  
  •	URL:http://localhost:3000/search_article
    
    
  ## API測試(8)-透過文章ID查詢貼文
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/search_articleByID
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    
  ## API測試(9)-刪除貼文
  •	HTTP Method: PUT
  
  •	URL:http://localhost:3000/delete_article
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    
  ## API測試(10)-使用者按讚
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/likes_article
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    
    o	likesPersonID: 按讚人的ID

  ## API測試(11)-使用者收回讚
  •	HTTP Method: PUT
  
  •	URL: http://localhost:3000/dislikes_article    
  
  •	Body(form-data):
  
    o	articleID: 複製發送貼文中的文章ID
    
    o	dislikesPersonID: 取消讚的ID

  ## API測試(12)-使用者留言
 	•	HTTP Method: POST
  
  •	URL: http://localhost:3000/add_comment    
  
  •	Body(form-data):
  
    o	commenterID: test
    
    o	articleID: 複製發送貼文中的文章ID
    
    o	content: test
   
  ## API測試(13)-使用者留言按讚
  •	HTTP Method: PUT
  
  •	URL: http://localhost:3000/likes_comment   
  
  •	Body(form-data):
  
    o	articleID: 複製發送貼文中的文章ID
    
    o	likesPersonID: 按讚人的ID
   
  ## API測試(14)-使用者留言收回讚
  •	HTTP Method: PUT
  
  •	URL: http://localhost:3000/dislikes_comment        
  
  •	Body(form-data):
  
    o	articleID: 複製發送貼文中的文章ID
    
    o	dislikesPersonID: 取消讚的ID
    
  ## API測試(15)-使用者刪除留言
  •	HTTP Method: PUT
  
  •	URL: http://localhost:3000/delete_comment        
  
  •	Body(form-data):
  
    o	commentID: 留言者的ID
    
  ## API測試(16)-使用者刪除留言
  •	HTTP Method: PUT
  
  •	URL: http://localhost:3000/update_comment        
  
  •	Body(form-data):
  
    o	commentID: 留言者的ID
    
    o	content: test
    
   

   

   
    
