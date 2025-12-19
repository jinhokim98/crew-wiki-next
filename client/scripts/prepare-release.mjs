#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

/* ------------------ constants ------------------ */
const OWNER = 'jinhokim98';
const REPO = 'crew-wiki-next';
const FULL_REPO = `${OWNER}/${REPO}`;

/* ------------------ path utils ------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PACKAGE_JSON = path.join(ROOT, 'package.json');
const LAYOUT_TSX = path.join(ROOT, 'src/app/layout.tsx');

/* ------------------ helpers ------------------ */
function run(command, silent = false) {
  if (!silent) console.log(`\n$ ${command}`);
  return execSync(command, {stdio: silent ? 'pipe' : 'inherit'})
    ?.toString()
    ?.trim();
}

function fail(message) {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function isValidVersion(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/* ------------------ pre checks ------------------ */
function ensureGhInstalled() {
  try {
    run('gh --version', true);
  } catch {
    fail('GitHub CLI(gh)가 설치되어 있지 않습니다.\n👉 https://cli.github.com/');
  }
}

function ensureGhAuthenticated() {
  try {
    run('gh auth status', true);
  } catch {
    fail('GitHub CLI(gh)에 로그인되어 있지 않습니다. (gh auth login)');
  }
}

function ensureDevelopBranch() {
  const branch = run('git branch --show-current', true);
  if (branch !== 'develop') {
    fail(`현재 브랜치가 develop이 아닙니다. (현재: ${branch})`);
  }
}

function ensureNoOpenReleasePr() {
  const count = run(
    `gh pr list \
      --repo ${FULL_REPO} \
      --base main \
      --head develop \
      --state open \
      --json number \
      --jq "length"`,
    true,
  );

  if (Number(count) > 0) {
    fail('이미 열려있는 develop → main 릴리즈 PR이 있습니다.');
  }
}

/* ------------------ main ------------------ */
ensureGhInstalled();
ensureGhAuthenticated();
ensureDevelopBranch();
ensureNoOpenReleasePr();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('다음 배포 버전을 입력해주세요 ex) X.Y.Z : ', version => {
  if (!isValidVersion(version)) {
    fail('버전 형식이 올바르지 않습니다. (X.Y.Z)');
  }

  console.log(`\n▶ 배포 버전: v${version}`);

  /* 1. package.json */
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
  if (pkg.version === version) {
    fail(`이미 package.json version이 ${version} 입니다.`);
  }

  pkg.version = version;
  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + '\n');

  /* 2. layout.tsx */
  const layout = fs.readFileSync(LAYOUT_TSX, 'utf-8');
  const updatedLayout = layout.replace(/data-version="[^"]*"/, `data-version="${version}"`);

  if (layout === updatedLayout) {
    fail('layout.tsx의 data-version을 변경하지 못했습니다.');
  }

  fs.writeFileSync(LAYOUT_TSX, updatedLayout);

  /* 3. 변경사항 확인 */
  const diff = run('git status --porcelain', true);
  if (!diff) {
    fail('변경된 파일이 없습니다.');
  }

  /* 4. commit */
  run('git add package.json src/app/layout.tsx');
  run(`git commit -m "chore: release v${version}"`);

  /* 5. push */
  run('git push test develop');

  /* 6. create PR */
  run(
    `gh pr create \
      --repo ${FULL_REPO} \
      --base main \
      --head develop \
      --title "v${version}" \
      --generate-notes`,
  );

  console.log('\n✅ 릴리즈 PR 생성 완료');
  rl.close();
});
