# Social Media
## API測試(1)-註冊
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/insert
  
  •	Body(x-www-form-urlencoded):  
  
    o name: test
    o password: test 
    o email: test@gmail.com
    
## API測試(2)-登入
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/login
  
  •	Body(x-www-form-urlencoded):
  
    o name: test
    o password: test 
    o email: test@gmail.com
    
  •	於headers中取的token
## API測試(3)-修改
  •	HTTP Method: PUT
  
  •	URL:http://localhost:3000/update
  
  •	Headers:
  
    o Content-Type: application/x-www-form-urlencoded
    o token: 貼上登入取得的token
    
  •	Body(x-www-form-urlencoded):
  
    o name: test
    o password: test123
    o email: test@gmail.com
 
 ## API測試(4)-發送貼文
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/add_article
    
  •	Body(form-data):
  
    o title: test
    o name: test
    o category: testing
    o content: test123
  
 ## API測試(5)-更改貼文
  •	HTTP Method: PUT
  
  •	URL:http://localhost:3000/update_article
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    o content: test456
  
  ## API測試(6)-查詢全部貼文
  •	HTTP Method: GET
  
  •	URL:http://localhost:3000/search_article
    
  •	Body(form-data):
  
    o name: test
    
  ## API測試(7)-透過ID查詢貼文
  •	HTTP Method: POST
  
  •	URL:http://localhost:3000/search_articleByID
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    
  ## API測試(8)-刪除貼文
  •	HTTP Method: PUT
  
  •	URL:http://localhost:3000/delete_article
    
  •	Body(form-data):
  
    o articleID: 複製發送貼文中的文章ID
    
