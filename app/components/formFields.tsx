import { useState } from "react";

export default function FormFields() {
    const [nome, setNome] = useState<string>("")
    const [senha, setSenha] = useState<string>("")
    const [observacao, setObservacao] = useState<string>("")

    return (
        <div className="flex items-center justify-center text-sm">
          <div className="flex flex-wrap gap-4 w-[60%] border-1 border-black-300 p-3 rounded-md">
            <div className="flex flex-col w-full sm:w-[30%]">
              <label htmlFor="nome" className="text-sm font-medium">NOME</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Nome do site/App"
              />
            </div>
      
            <div className="flex flex-col w-full sm:w-[30%]">
              <label htmlFor="senha" className="text-sm font-medium">SENHA</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Senha"
              />
            </div>
      
            <div className="flex flex-col w-full sm:w-[30%]">
              <label htmlFor="observacao" className="text-sm font-medium">OBSERVAÇÃO</label>
              <input
                type="text"
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Observação"
              />
            </div>
          </div>
        </div>
      );
}