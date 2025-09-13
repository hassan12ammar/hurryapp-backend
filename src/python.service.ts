import { Injectable } from '@nestjs/common'
import { spawn } from 'child_process'

@Injectable()
export class PythonService {
  runPython(path: string, a: number, b: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const process = spawn('python3', [path, a.toString(), b.toString()])
      let output = ''

      process.stdout.on('data', data => (output += data.toString()))
      process.stderr.on('data', data => reject(data.toString()))

      process.on('close', () => {
        const { result } = JSON.parse(output)
        resolve(result)
      })
    })
  }
}
