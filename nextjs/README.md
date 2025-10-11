# Nextjs

使用过 Nextjs 一段时间后的总结。包括用到的 API、问题、理解。

1. 全栈开发框架
2. App Router 和 Page Router。用了 App Router
3. Nextjs 自带很多库实现很多功能。如：国际化、登录鉴权、登录页实现模式等
4. 配合 prisma ORM 做服务端
5. 部署用 pm2

## App Router

1. 一个文件就是一个路由，文件夹下的 `page.js` 就是路由入口文件。
2. 文件夹下的 `layout.js` 就是布局文件，会包裹 `page.js`。
3. 文件夹下的 `loading.js` 就是加载中的文件，会在 `page.js` 加载中显示。
4. `page.tsx` 是嵌套文件夹就是页面地址
5. 跳转页面用 `Link` 组件，来自 `next/link`。也可以用 `router.push` 跳转，来自 `next/navigation`的 useRouter hook。

## 鉴权

1. 登录鉴权用 `next-auth` 库。
2. 登录主要 API 有 `signIn`、`signUp`、`signOut` 三种。来自 next-auth/react
3. 登录后可以用 `useSession` hook 来获取登录信息。
4. 服务端登录逻辑需要在 api 文件夹下新建 `auth/[...nextauth]/route.ts` 文件。
   1. 这个文件使用 NextAuth 传入配置后会返回一系列 API，如：`/api/auth/signin`、`/api/auth/signout` 等。
   2. 在登录时调用 signIn 方法，会自动走到第一步传入的配置的`CredentialsProvider`，
      1. 这个`CredentialsProvider`使用 name、credentials、authorize 来配置
      2. `authorize` 是一个 async 函数，用来验证登录信息，signIn 方法会自动调用这个函数。如果验证成功，返回用户信息；如果验证失败，返回 null。
      3. `authorize` 函数可以接收一个对象，对象的 key 就是`credentials`中配置的 key，value 就是登录时传入的 value。
      4. `authorize`中可以做自定义的登录逻辑。这个系统中做的是先找接口获取 code，再找接口获取 token，再通过 token 获取用户信息，最后返回用户信息。
   3. authorize 返回用户信息，系统即识别为登录成功，返回用户信息。
   4. 如果 authorize 返回 null，系统会识别为登录失败。
   5. 和 provider 同级还有 callbacks 配置
      1. 主要用到了 `signIn`、`session`、`jwt` `authorized` `redirect`
      2. 在 authorized 返回后走到`signIn`。signIn 返回用户信息
      3. signIn 返回用户信息后，会走到`jwt`回调，jwt 最终需要返回 token 对象。jwt 有几种情况下会进入。
         1. 如果参数中有 user，说明是从 signIn 登录过来的就 return user
         2. 否则，如果 trigger === 'update'，说明是从 session 更新过来的，更新 token 信息
         3. 否则，判断 token 种的有效期是否过期，如果未过期直接返回 token；如果已过期，则尝试调用刷新 token 接口刷新 token 后返回 token。
      4. jwt 返回后走到 session 回调。session 回调中主要判断 jwt 的返回值(token)中是否有 accessToken，如果没有就需要登录，有则将 user 信息合并到 session 中返回 session 信息
      5. 登录成功后跳转系统入口页
   6. 登录后可以用 `useSession` hook 来获取登录信息。如果session中与user信息，则说明是登录状态，否则跳转登录页。这个判断是在系统中的入口layout文件中判断的。

## 接口开发

主要使用ORM框架prisma。ORM（Object-Relational Mapping）是一种用于数据库操作的技术，它将数据库中的表映射为对象，使开发人员可以使用面向对象的方式来操作数据库。之前对于数据库和代码的关系一直不是很清楚，做了这个之后才知道只是使用一种开源框架后代码就可直接操作数据库了。
1. prisma 是一个 ORM 框架，它可以将数据库中的表映射为对象，使开发人员可以使用面向对象的方式来操作数据库。
2. prisma 可以根据数据库中的表自动生成模型文件，开发人员可以直接使用这些模型文件来操作数据库。
3. prisma 支持多种数据库，如：MySQL、PostgreSQL、SQLite 等。
4. prisma 提供了丰富的 API，开发人员可以使用这些 API 来操作数据库。
5. prisma 还提供了命令行工具，开发人员可以使用这些工具来管理数据库。
