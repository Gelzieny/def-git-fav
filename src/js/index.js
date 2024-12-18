const addButton = document.getElementById('addButton')
const userList = document.getElementById('userList')

async function fetchGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (!response.ok) throw new Error('Usuário não encontrado')
    const data = await response.json()

    return {
      name: data.name || username,
      avatar: data.avatar_url,
      login: data.login,
      repositories: data.public_repos,
      followers: data.followers,
    }
  } catch (error) {
    alert(error.message)
    return null
  }
}

function isUserAlreadyInTable(username) {
  const existingUsers = Array.from(userList.querySelectorAll('.user'))
  return existingUsers.some(
    user => user.querySelector('.login').textContent === `/${username}`
  )
}

async function addUser() {
  const usernameInput = document.getElementById('username')
  const username = usernameInput.value.trim()

  if (!username) {
    alert('Digite um nome de usuário válido!')
    return
  }

  if (isUserAlreadyInTable(username)) {
    alert('Este usuário já foi adicionado!')
    return
  }

  const userData = await fetchGitHubUser(username)
  if (userData) {
    const userRow = document.createElement('tr')
    userRow.innerHTML = `
      <td class="user">
        <img  src="${userData.avatar}" alt="${userData.name}">
        <span class="name">${userData.name} </span><br>
        <span class="login">/${userData.login}</span>
      </td>
      <td class="Repositories">${userData.repositories}</td>
      <td class="Followers">${userData.followers}</td>
      <td><span class="remove">Remover</span></td>
    `

    userRow.querySelector('.remove').addEventListener('click', () => {
      const confirmation = confirm(
        'Tem certeza que deseja remover este usuário?'
      )
      if (confirmation) {
        userRow.remove()
        checkEmptyTable() // Verifica se a tabela está vazia após remoção
      }
    })

    userList.appendChild(userRow)
    checkEmptyTable() // Verifica se a tabela está vazia após adicionar um usuário

    usernameInput.value = ''
  }
}

function checkEmptyTable() {
  const noDataRow = document.querySelector('.no-data')
  const isTableEmpty = userList.children.length === 0
  if (isTableEmpty) {
    noDataRow.style.display = 'table-row'
  } else {
    noDataRow.style.display = 'none'
  }
}

addButton.addEventListener('click', addUser)

document.getElementById('username').addEventListener('keypress', e => {
  if (e.key === 'Enter') addUser()
})
