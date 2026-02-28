export default function commitlintFormatter(results) {
    console.log('✅ Commit message 验证...');
    if (results.valid) {
        console.log('✅ Commit message 验证通过！');
        return '';
    }
    console.log('\n❌ Commit message 验证失败：');
    console.log(`   错误数量: ${results.errorCount}`);
    console.log(`   警告数量: ${results.warningCount}`);
    console.log(`   提交内容: "${results.results[0]?.input || '未知'}"`);
    const errorMessages = {
        'header-max-length': '长度不能超过 72 个字符',
        'type-enum': '无效的提交类型',
        'scope-enum': '无效的作用域',
        'type-empty': '提交类型不能为空',
        'scope-empty': '提交作用域不能为空',
        'subject-empty': '提交描述不能为空',
        'subject-full-stop': '提交描述不能以句号结尾',
        'subject-case': '提交描述格式错误',
        'header-full-stop': 'Commit message 不能以句号结尾',
    };
    console.log('\n   ❌ 具体错误:');
    results.results.forEach((result) => {
        result.errors.forEach((error, index) => {
            const message = errorMessages[error.name] || error.message;
            console.log(`     ${index + 1}. ${message}`);
        });
    });
    console.log('\n💡 正确格式示例:');
    console.log('   1. feat(components): 添加新的健身课程组件');
    console.log('   2. fix(core): 修复姿态识别算法 bug');
    console.log('   3. docs: 更新 README 文件');
    console.log('   4. refactor(util): 优化日期处理函数');
    console.log('\n\x1b[1;33m🔔 提示: 可以执行 pnpm git:commit 进行标准提交\x1b[0m');
    process.exitCode = 1;
    return '';
}
