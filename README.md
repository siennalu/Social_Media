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
  
   
    
