# Dockerfileはどんな環境を作るかの設計図
# 1. ベースとなるイメージ（Pythonが入った箱）を指定
FROM python:3.13.3

# 2. 作業ディレクトリ（/app）を作る・移動、Docker内にできるフォルダ
WORKDIR /app

# 3. 必要なライブラリ一覧（requirements.txt）を先にコピー
COPY requirements.txt .

# 4. ライブラリを全部インストール（pip install）
RUN pip install --no-cache-dir -r requirements.txt

# 5. プロジェクトファイル全部を箱にコピー
COPY . .

# 6. サーバーの起動コマンドを指定（FastAPIならuvicorn）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
