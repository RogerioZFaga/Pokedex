const apiBaseUrl = 'https://pokeapi.co/api/v2';
const pokemonList = document.getElementById('pokemon-list');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('pokemon-details');
const closeModal = document.getElementsByClassName('close')[0];
const teamList = document.getElementById('team-list');
let team = [];

const fetchPokemon = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const displayPokemon = (pokemon) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name} (#${pokemon.id})</h3>
        <p>Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <button onclick="showDetails(${pokemon.id})">Info</button>
        <button onclick="addToTeam(${pokemon.id})">Adicionar à Equipe</button>
    `;
    pokemonList.appendChild(pokemonCard);
};

const loadPokemons = async () => {
    const data = await fetchPokemon(`${apiBaseUrl}/pokemon?limit=151`);
    for (const result of data.results) {
        const pokemon = await fetchPokemon(result.url);
        displayPokemon(pokemon);
    }
};

const showDetails = async (id) => {
    const pokemon = await fetchPokemon(`${apiBaseUrl}/pokemon/${id}`);
    const species = await fetchPokemon(pokemon.species.url);
    const locations = await fetchPokemon(`${apiBaseUrl}/pokemon/${id}/encounters`);

    modalContent.innerHTML = `
        <h2>${pokemon.name} (#${pokemon.id})</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Altura: ${pokemon.height / 10} m</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <p>Habilidades: ${pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
        <p>Tipos: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <p>Locais: ${locations.map(location => location.location_area.name).join(', ')}</p>
    `;
    modal.style.display = 'block';
};

const addToTeam = async (id) => {
    if (team.length < 6 && !team.includes(id)) {
        const pokemon = await fetchPokemon(`${apiBaseUrl}/pokemon/${id}`);
        team.push(id);
        updateTeam(pokemon);
    } else {
        alert('A equipe está cheia ou o Pokémon já está na equipe');
    }
};

const updateTeam = (pokemon) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name} (#${pokemon.id})</h3>
        <button onclick="removeFromTeam(${pokemon.id})">Remover</button>
    `;
    teamList.appendChild(pokemonCard);
};

const removeFromTeam = (id) => {
    team = team.filter(pokemonId => pokemonId !== id);
    updateTeamList();
};

const updateTeamList = async () => {
    teamList.innerHTML = '';
    for (const id of team) {
        const pokemon = await fetchPokemon(`${apiBaseUrl}/pokemon/${id}`);
        updateTeam(pokemon);
    }
};

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.toLowerCase();
    pokemonList.innerHTML = '';
    const data = await fetchPokemon(`${apiBaseUrl}/pokemon?limit=151`);
    for (const result of data.results) {
        if (result.name.includes(query) || result.url.split('/').reverse()[1] === query) {
            const pokemon = await fetchPokemon(result.url);
            displayPokemon(pokemon);
        }
    }
});

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

loadPokemons();
