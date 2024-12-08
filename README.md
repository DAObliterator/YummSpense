This app was made because i was too lazy to calculate the total money that i burned on food that i bought from a eatery in campus ( Yummpies ) hence the name yummspense , this only counts online orders , 
so i probably spent way more. 

Yummpies sends a receipt every time you order through their website , it includes information like order id items quantity total price etc , its sent as html.

Used the gmail api to get the messages which includes the order receipt

Although you could use packages like cheerio to extract info from html , i noticed that info was pretty deeply nested and so decided to send the entire html as a string along with a prompt to gemini api and then work from there
