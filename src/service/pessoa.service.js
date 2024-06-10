import { ApiService } from './api.service'

export class PessoaService {
  api = new ApiService()

  constructor() {}

  async buscaTodasPessoas() {
    const data = await this.api.get('pessoa').catch((e) => {
      throw new Error(e.message)
    })
    return data?.data ?? []
  }
  async buscaPessoa(id) {
    const data = await this.api.get(`pessoa/${id}`).catch((e) => {
      throw new Error(e.message)
    })
    return data?.data ?? null
  }
  async adicionaPessoa(nome) {
    const data = await this.api.post('pessoa', { nome }).catch((e) => {
      throw new Error(e.message)
    })
    return data?.data ?? null
  }
  async atualizaPessoa(id, nome) {
    const data = await this.api.put(`pessoa/${id}`, { nome }).catch((e) => {
      throw new Error(e.message)
    })
    return data?.data ?? null
  }

  async removePessoa(id) {
    const data = await this.api.delete(`pessoa/${id}`).catch((e) => {
      throw new Error(e.message)
    })
    return data.message
  }
}
export const pessoaService = new PessoaService()
