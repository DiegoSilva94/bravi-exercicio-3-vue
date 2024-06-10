<script setup>
import { ref } from 'vue'
import { pessoaService } from '@/service/pessoa.service.js'
import { contatoService } from '@/service/contato.service.js'
import { useRoute, useRouter } from 'vue-router'
const $route = useRoute()
const router = useRouter()

const pessoaId = ref($route.params.id)
const pessoa = ref({})
const editarContatos = ref([])
const adicionaContatos = ref([{ id: null, tipo: '', informacao: '' }])
const removeContatos = ref([])

if (pessoaId.value) {
  pessoaService
    .buscaPessoa(pessoaId.value)
    .then((pessoaDados) => {
      pessoa.value = pessoaDados
      contatoService.buscaContatosPessoa(pessoa.value).then((contatos) => {
        editarContatos.value = contatos
      })
    })
    .catch(() => {
      this.router.push({ name: 'home' })
    })
}
async function onSubmit() {
  let pessoaData = null
  if (pessoaId.value) {
    pessoaData = await pessoaService.atualizaPessoa(pessoa.value.id, pessoa.value.nome)
  } else {
    pessoaData = await pessoaService.adicionaPessoa(pessoa.value.nome)
  }
  if (!pessoaData) {
    // TODO aplica validação do formulario para usuario
    return
  }
  for (let contato of editarContatos.value) {
    if (!contato.informacao) continue
    await contatoService.atualizaContato(pessoaData, contato)
    // TODO validar atualização do cadastro
  }
  for (let contato of removeContatos.value) {
    await contatoService.removeContato(pessoaData, contato)
    // TODO validar remoção do cadastro
  }
  for (let contato of adicionaContatos.value) {
    if (!contato.tipo || !contato.informacao) continue
    await contatoService.adicionaContato(pessoaData, contato)
    // TODO validar adição do cadastro
  }
  await router.push({
    name: 'pessoa.view',
    params: { id: pessoaData.id }
  })
}
function excluirContato(index) {
  removeContatos.value.push(...editarContatos.value.splice(index, 1))
}
function removeContato(index) {
  adicionaContatos.value.splice(index, 1)
}
function adicionaContato() {
  adicionaContatos.value.push({ id: null, tipo: '', informacao: '' })
}
</script>
<template>
  <div>
    <div class="px-4 sm:px-0 max-w-2xl mx-auto" v-if="pessoaId === undefined">
      <h2 class="text-base font-semibold leading-7 text-gray-900">Cadastro de nova pessoa</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">
        Um cadastro simples de pessoa e seus contatos.
      </p>
    </div>
    <div class="px-4 sm:px-0 max-w-2xl mx-auto" v-else>
      <h2 class="text-base font-semibold leading-7 text-gray-900">Editar {{ pessoa.nome }}</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">
        Edite os dados de contato e até o nome da pessoa.
      </p>
    </div>
    <form
      class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 max-w-2xl mx-auto mt-12"
      @submit.prevent="onSubmit()"
    >
      <div class="px-4 py-6 sm:p-8">
        <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-6">
            <label for="nome" class="block text-sm font-medium leading-6 text-gray-900">Nome</label>
            <div class="mt-2">
              <input
                type="text"
                v-model="pessoa.nome"
                id="nome"
                name="nome"
                autocomplete="nome"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h3 class="text-base font-semibold leading-7 text-gray-900 px-4 sm:px-8 pt-4">
        Dados de contato
      </h3>
      <div
        class="px-4 py-6 sm:p-8"
        v-for="(contatoEditar, index) in editarContatos"
        :key="contatoEditar.id"
      >
        <div class="grid max-w-2xl grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-7">
          <div class="cols-span-4 sm:col-span-2">
            <label
              :for="'atualizarTipo' + index"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Tipo</label
            >
            <div class="mt-2">
              <select
                v-model="contatoEditar.tipo"
                :id="'atualizarTipo' + index"
                disabled
                :name="'atualizarTipo' + index"
                autocomplete="country-name"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" selected disabled>Escolha um tipo</option>
                <option value="1">Telefone</option>
                <option value="2">E-mail</option>
                <option value="3">Whatsapp</option>
              </select>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-4">
            <label
              :for="'atualizarInformacao' + index"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Dados</label
            >
            <div class="mt-2">
              <input
                type="text"
                v-model="contatoEditar.informacao"
                :id="'atualizarInformacao' + index"
                :name="'atualizarInformacao' + index"
                autocomplete="nome"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="col-span-1 grid justify-center content-center pt-6">
            <button type="button" @click="excluirContato(index)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 flex-none text-gray-400 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="px-4 py-2 sm:px-8" v-for="(contato, index) in adicionaContatos" :key="index">
        <div class="grid max-w-2xl grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-7">
          <div class="cols-span-4 sm:col-span-2">
            <label
              :for="'adicionarTipo' + index"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Tipo</label
            >
            <div class="mt-2">
              <select
                v-model="contato.tipo"
                :id="'adicionarTipo' + index"
                :name="'adicionarTipo' + index"
                autocomplete="country-name"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" selected disabled>Escolha um tipo</option>
                <option value="1">Telefone</option>
                <option value="2">E-mail</option>
                <option value="3">Whatsapp</option>
              </select>
            </div>
          </div>
          <div class="col-span-3 sm:col-span-4">
            <label
              :for="'adicionarInformacao' + index"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Dados</label
            >
            <div class="mt-2">
              <input
                type="text"
                v-model="contato.informacao"
                :id="'adicionarInformacao' + index"
                :name="'adicionarInformacao' + index"
                autocomplete="nome"
                class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="col-span-1 grid justify-center content-center pt-6">
            <button
              type="button"
              @click="removeContato(index)"
              v-if="adicionaContatos.length > index + 1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 flex-none text-gray-400 inline-block"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
            <button type="button" @click="adicionaContato()" v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5 flex-none text-gray-400 inline-block"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 mt-4"
      >
        <a href="/pessoa" type="button" class="text-sm font-semibold leading-6 text-gray-900"
          >Cancelar</a
        >
        <button
          type="submit"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ pessoaId ? 'Salvar' : 'Adicionar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
