<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {ref} from 'vue'




const API_URL = "http://localhost:8080"; // Backend API base URL

async function createUser() {
  try {
    const response = await fetch(`${API_URL}/create-user.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    console.log(result)
    getUsers().then(data => {
  console.log(data)
  users.value=data
});

  
    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || "Unknown error occurred." };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "An error occurred while creating the user." };
  }
}


async function getUsers() {
  try {
    // Send the GET request
    const response = await fetch(`${API_URL}/get-users.php`);

    // Check if the HTTP response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const result = await response.json();

    // Log messages or handle data
    if (result.message) {
      console.log(result.message);
    }

    if (result.users) {
      console.log("Users:", result.users);
      return result.users; // Return the users for further use
    } else {
      console.warn("No users found in the response.");
      return []; // Return an empty array if no users found
    }
  } catch (error) {
    // Log any errors encountered during the request
    console.error("Error fetching users:", error);
    return []; // Return an empty array in case of an error
  }
}

// Call the function and handle returned data

let users=ref()



getUsers().then(data => {
  console.log(data)
  users.value=data
});



const form = {
  username:'',
  email: '',
}



</script>

<template>

<div>
          <label for="username">username</label>
          <input type="text" v-model="form.username" id="username" />
        </div>
     
        <div>
          <label for="email">email</label>
          <input type="email" v-model="form.email" id="email" />
        </div>

<button v-on:click="createUser">test</button>

<div class="users">
  USERS
    <div v-for="user in users" :key="user.userid" class="event">
     <div class="username">USERNAME: {{ user.name }}</div>
     <div class="username">EMAIL: {{ user.email }}</div>

    </div>
  </div>
  

  <!-- <header> -->
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
    
      <HelloWorld msg="You did it!" />


      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
