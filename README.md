# Web application
Simple online shop, implemented on AngularJS.<br>

## Download & Get started
1. Open `Git Bash`.
2. Change the current working directory to the location where you want the cloned directory to be made.
3. Type git clone, and then paste the URL:
```
 git clone https://github.com/Dwarfess/online-ads.git
```
4. Move to the application folder
```
 cd online-ads
```
5. Сommand to install dependencies from `package.json`
```
 npm install --save-dev
```
6. Сommand to run the application
```
 nodemon
```
7. Open in your browser address [localhost:3000](http://localhost:3000)

8. To stop the application, press `CTRL+C`


**ATTENTION: In order to launch the application on your computer, you must first be running `MongoDB` on port 27017 and an updated version `NodeJS`. Detailed description of the installation of the `MongoDB` you can find [here](https://metanit.com/nosql/mongodb/1.2.php)**

## Brief description of application operation

### Unauthorized users can
   * Search and browse ads
   * Login/register to app to do more

### Authorized users can
   * Update your account
   * Search and browse ads
   * Create new ads
   * Update your ads
   * Delete your ads
   * Upload an image for your ads
   * Delete an image for your ads ("cross" icon near the image)




**(in case somebody trying to create/change/delete ads, the authorization window appears)**
