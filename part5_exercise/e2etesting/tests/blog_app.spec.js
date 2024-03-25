const { test, expect, beforeEach, describe } = require('@playwright/test')
const { name } = require('../playwright.config')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test.only('Login form is shown', async ({ page }) => {
    const usernameinput = await page.getByText('username')
    await expect(usernameinput).toBeVisible()
    const passwordinput=await page.getByText('password')
    await expect(passwordinput).toBeVisible()
  })
  
  describe("Login",()=>{
    test.only('succeeds with correct credentials',async({page})=>{
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill("salainen")
        await page.getByRole('button',{name:"login"}).click()
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    test.only('fails with incorrect credentials',async({page})=>{
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill("wrong password")
        await page.getByRole('button',{name:"login"}).click()
        await expect(page.getByText('Wrong credentials')).toBeVisible()

    })
  })

  describe('When logged in',()=>{
    beforeEach(async({page,request})=>{
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill("salainen")
      await page.getByRole('button',{name:"login"}).click()
      await request.post('api/users', {
        data: {
          name: 'Jerome Goh',
          username: 'JDASAVAGE',
          password: 'salainen'
        }
      })
    })
    test.only("a new block can be created", async({page})=>{
      await page.getByRole('button',{name:"new note"}).click()
      await page.getByPlaceholder("write title here").fill("a blog created by playwright")
      await page.getByPlaceholder("write author here").fill("William Shakespeare")
      await page.getByPlaceholder("write url here").fill("www.test.com")
      await page.getByRole('button',{name:"create"}).click()
      await expect(page.getByText('a blog created by playwright William Shakespeare')).toBeVisible()
    })
    test.only("a blog can be liked",async({page})=>{
        await page.getByRole('button',{name:"new note"}).click()
        await page.getByPlaceholder("write title here").fill("a blog created by playwright")
        await page.getByPlaceholder("write author here").fill("William Shakespeare")
        await page.getByPlaceholder("write url here").fill("www.test.com")
        await page.getByRole('button',{name:"create"}).click()
        await page.getByRole("button",{name:"view"}).click()
        await page.getByRole("button",{name:"like"}).click()
        await expect(page.getByText("likes 1")).toBeVisible()
    })
    test.only("a blog can be deleted",async({page})=>{
      await page.getByRole('button',{name:"new note"}).click()
      await page.getByPlaceholder("write title here").fill("a blog created by playwright")
      await page.getByPlaceholder("write author here").fill("William Shakespeare")
      await page.getByPlaceholder("write url here").fill("www.test.com")
      await page.getByRole('button',{name:"create"}).click()
      await page.getByRole("button",{name:"view"}).click()
      await page.getByRole("button",{name:"remove"}).click()
      page.on('dialog', async (dialog) => {await dialog.accept()})
      await expect(page.getByText('www.test.com')).not.toBeVisible()
    })
    test.only("a blog's delete button can only be seen by user that created it", async({page})=>{
      await page.getByRole('button',{name:"new note"}).click()
      await page.getByPlaceholder("write title here").fill("a blog created by playwright")
      await page.getByPlaceholder("write author here").fill("William Shakespeare")
      await page.getByPlaceholder("write url here").fill("www.test.com")
      await page.getByRole('button',{name:"create"}).click()
      await page.getByRole("button",{name:"view"}).click()
      const removeButton = await page.getByRole("button", { name: "remove" })
      await expect(page.getByText('a blog created by playwright William Shakespeare')).toBeVisible()
      await page.getByRole('button',{name:"logout"}).click()
      await page.getByTestId('username').fill('JDASAVAGE')
      await page.getByTestId('password').fill("salainen")
      await page.getByRole('button',{name:"login"}).click()
      await expect(page.getByText('Jerome Goh logged in')).toBeVisible()
      await page.getByRole("button",{name:"view"}).click()
      await expect(removeButton).not.toBeVisible()
    })
    test.only("blogs are arranged in the order according to likes",async({page})=>{
      await page.getByRole('button',{name:"new note"}).click()
      await page.getByPlaceholder("write title here").fill("a blog created by playwright")
      await page.getByPlaceholder("write author here").fill("William Shakespeare")
      await page.getByPlaceholder("write url here").fill("www.test.com")
      await page.getByRole('button',{name:"create"}).click()
      await page.getByPlaceholder("write title here").fill("the tragedy of samantha")
      await page.getByPlaceholder("write author here").fill("Life")
      await page.getByPlaceholder("write url here").fill("www.damn.com")
      await page.getByRole('button',{name:"create"}).click()
      await page.getByRole('button').last().click()
      await page.getByRole('button').last().click()
      await page.getByRole('button').last().click()
      await expect(page.getByText('a blog created by playwright')).toBeVisible()

    })
})

})