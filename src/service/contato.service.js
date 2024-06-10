import { ApiService } from './api.service'

export class ContatoService {
  api = new ApiService()

  constructor() {}

  async buscaContatosPessoa(pessoa) {
    const data = await this.api.get(`pessoa/${pessoa.id}/contato`).catch((e) => {
      throw new Error(e.message)
    })
    return data?.data ?? []
  }
  async adicionaContato(pessoa, contato) {
    const data = await this.api
      .post(`pessoa/${pessoa.id}/contato`, {
        tipo: contato.tipo,
        informacao: contato.informacao
      })
      .catch((e) => {
        throw new Error(e.message)
      })
    return data?.data ?? null
  }
  async atualizaContato(pessoa, contato) {
    const data = await this.api
      .put(`pessoa/${pessoa.id}/contato/${contato.id}`, {
        informacao: contato.informacao
      })
      .catch((e) => {
        throw new Error(e.message)
      })
    return data?.data ?? null
  }

  async removeContato(pessoa, contato) {
    const data = await this.api.delete(`pessoa/${pessoa.id}/contato/${contato.id}`).catch((e) => {
      throw new Error(e.message)
    })
    return data.message
  }
}
export const contatoService = new ContatoService()
