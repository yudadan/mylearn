#!/usr/bin/env python

from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import selenium.webdriver.chrome.service as service

from selenium.webdriver.support.ui import WebDriverWait
driver = webdriver.Chrome()
driver.get('http://mail.sina.net/login');
el =  WebDriverWait(driver, 10).until(lambda x: x.find_element_by_id("loginfromemail"))
print(el.text)
exit(0)

#print(DesiredCapabilities.CHROME)
#driver = webdriver.Remote('http://127.0.0.1:9515', DesiredCapabilities.CHROME)
#driver = webdriver.Chrome('/usr/local/bin/chromedriver',9515)
#driver.get('http://mail.sina.net');
#print(driver.title)

from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


chrome_options = Options()
chrome_options.add_argument("--disable-extensions")
chrome_options.add_argument('--disable-logging')
#driver = webdriver.Chrome(chrome_options=chrome_options)
#driver.get('http://mail.sina.net');
#print(driver.title)
 
import selenium.webdriver.chrome.service as service

service = service.Service('C:\Python27\chromedriver.exe')
service.start()
capabilities = { }
driver = webdriver.Remote(service.service_url, capabilities)
driver.get('http://mail.sina.net');
print(driver.title)