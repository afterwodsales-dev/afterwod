/**
 * Script de depuración para identificar problemas de renderizado
 * Ejecutar en la consola del navegador
 */

console.log('🔍 === DIAGNÓSTICO DE PANTALLA NEGRA ===\n');

// 1. Verificar que React está cargado
console.log('1️⃣ Verificando React...');
if (typeof React !== 'undefined') {
    console.log('✅ React está cargado');
} else {
    console.log('❌ React NO está cargado');
}

// 2. Verificar el DOM
console.log('\n2️⃣ Verificando DOM...');
const root = document.getElementById('root');
if (root) {
    console.log('✅ Elemento #root encontrado');
    console.log(`   Contenido: ${root.innerHTML.length > 0 ? 'Tiene contenido' : 'VACÍO'}`);
    console.log(`   Hijos: ${root.children.length}`);
} else {
    console.log('❌ Elemento #root NO encontrado');
}

// 3. Verificar estilos
console.log('\n3️⃣ Verificando estilos...');
const bodyBg = window.getComputedStyle(document.body).backgroundColor;
console.log(`   Background del body: ${bodyBg}`);
if (root) {
    const rootBg = window.getComputedStyle(root).backgroundColor;
    console.log(`   Background del #root: ${rootBg}`);
}

// 4. Verificar errores en consola
console.log('\n4️⃣ Verificando errores...');
console.log('   Revisa arriba si hay mensajes en ROJO');

// 5. Verificar Firebase
console.log('\n5️⃣ Verificando Firebase...');
if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase está cargado');
} else {
    console.log('⚠️  Firebase no está en el scope global (esto es normal con módulos ES6)');
}

// 6. Verificar Router
console.log('\n6️⃣ Verificando Router...');
console.log(`   URL actual: ${window.location.href}`);
console.log(`   Hash: ${window.location.hash}`);

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Copia TODO este output y envíalo');
console.log('2. Si ves errores en ROJO arriba, cópialos también');
console.log('3. Toma una captura de pantalla de la pestaña "Elements" mostrando el contenido de #root');
