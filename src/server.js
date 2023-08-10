//Servidor
import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'

// a medida que o dado chegou manda para a função sendo uma stream, um generator
function * run () {
  for(let index = 0; index <= 99; index++) {
    const data = {
      id: randomUUID(),
      name: `Josué-${index}`
    }
    // funciona se tiver o * na assinatura da funcao, vai devolver os dados, nao esperando todo o for
    yield data
  }
}

async function handler(request, response) {
  //new é opcional
  const readable = new Readable({
    //Como vai gerar as informaçoes
    read() {
      for(const data of run()) {
        console.log(`sending`, data)
        this.push(JSON.stringify(data) + "\n")
      }
      //para informar que os dados acabaram
      this.push(null)
    }
  })
  // cada pipe mandamos para um processo diferente como converter
  readable
      .pipe(response)
}

http.createServer(handler)
.listen(3000)
.on('listening', () => console.log('server running on port 3000'))