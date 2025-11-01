<?php
// =============================================
// API PARA FORNECER DADOS AO JAVASCRIPT
// =============================================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Arquivo onde os dados estão salvos
$data_file = dirname(__DIR__) . '/data/server_stats.json';

// Verificar se o arquivo existe
if (!file_exists($data_file)) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Nenhum dado disponível',
        'message' => 'O servidor FiveM ainda não enviou dados',
        'last_update' => 'Nunca'
    ]);
    exit();
}

// Ler dados do arquivo
$file_content = file_get_contents($data_file);
$data = json_decode($file_content, true);

if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Dados corrompidos',
        'message' => 'Os dados recebidos estão corrompidos'
    ]);
    exit();
}

// Calcular há quanto tempo foi atualizado
$last_update = strtotime($data['last_update'] ?? 'now');
$now = time();
$minutes_ago = round(($now - $last_update) / 60);

// Responder com os dados
echo json_encode([
    'status' => 'success',
    'data' => $data['data'] ?? [],
    'server_info' => [
        'name' => $data['server_name'] ?? 'Desconhecido',
        'last_update' => $data['last_update'] ?? 'Nunca',
        'minutes_ago' => $minutes_ago,
        'data_type' => $data['data_type'] ?? 'unknown'
    ]
]);
?>