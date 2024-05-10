// Constants
import { REPOSITORY } from '@/constants/github'

// Third-Party libraries
import opener from 'opener'

// Utils
import { addCommitlint } from '@/utils/add-commitlint'
import { generateCommitlintConfig } from '@/utils/commitlint'
import { writeMessage } from '@/utils/console'
import { getErrorMessage } from '@/utils/errors'
import { generateHuskyConfig } from '@/utils/husky-library'
import { shouldPublishToNPM } from '@/utils/npm'
import { getPackageManger } from '@/utils/package-managers'
import { exists } from '@/utils/user-os'

// NodeJS
import process from 'node:process'

export const handlerOptionBuild = async () => {
  try {
    let shouldPublishToNpm = false

    const packageJsonPath = `${process.cwd()}/package.json`

    const existPackageJsonInTheCurrentDirectory = await exists(packageJsonPath)

    if (!existPackageJsonInTheCurrentDirectory) {
      writeMessage({
        type: 'error',
        message: getErrorMessage('NotFound')
      })

      process.exit(1)
    }

    const packageManagerToUse = await getPackageManger()

    if (packageManagerToUse === 'yarn') {
      shouldPublishToNpm = await shouldPublishToNPM()
    }

    const useCommitlint = await addCommitlint()

    await generateHuskyConfig({
      packageManagerToUse,
      packageJsonPath,
      useCommitlint,
      shouldPublishToNpm
    })

    if (useCommitlint) {
      await generateCommitlintConfig({ packageManagerToUse, packageJsonPath })
    }
  } catch {
    writeMessage({
      type: 'error',
      message: getErrorMessage('Default')
    })
    process.exit(1)
  }
}

export const handlerOptionCollaborate = () => {
  writeMessage({
    type: 'info',
    message: 'Opening the GitHub repository...'
  })

  setTimeout(() => opener(REPOSITORY), 500)
}
