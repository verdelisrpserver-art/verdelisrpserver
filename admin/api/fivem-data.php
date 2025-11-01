<?php
// =============================================
// CONFIGURAÇÃO DE SEGURANÇA
// =============================================
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Token secreto - DEVE SER IGUAL AO DO FIVEM
define('SECRET_KEY', 'VERDELIS_WEB_SECRET_2024');

// =============================================
// FUNÇÃO DE LOG PARA DEPURAÇÃO
// =============================================
function logMessage($message) {
    $log_file = dirname(__DIR__) . '/../logs/fivem_api.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($log_file, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
}

// =============================================
// VERIFICAÇÃO DE SEGURANÇA
// =============================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

// Verificar token de autorização
if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Token de autorização não fornecido']);
    logMessage('ERRO: Token não fornecido');
    exit();
}

$received_token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
if ($received_token !== SECRET_KEY) {
    http_response_code(403);
    echo json_encode(['error' => 'Token de autorização inválido']);
    logMessage('ERRO: Token inválido recebido: ' . $received_token);
    exit();
}

// =============================================
// PROCESSAR DADOS RECEBIDOS
// =============================================
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados JSON inválidos']);
    logMessage('ERRO: Dados JSON inválidos');
    exit();
}

// Verificar segredo nos dados
if (!isset($input['secret']) || $input['secret'] !== SECRET_KEY) {
    http_response_code(403);
    echo json_encode(['error' => 'Segredo inválido nos dados']);
    logMessage('ERRO: Segredo inválido nos dados');
    exit();
}

// =============================================
// SALVAR DADOS RECEBIDOS
// =============================================
try {
    $data_type = $input['type'] ?? 'unknown';
    $server_data = $input['data'] ?? [];
    $server_name = $input['server_name'] ?? 'Unknown Server';
    $timestamp = $input['timestamp'] ?? time();
    
    // Arquivo onde os dados serão salvos
    $data_file = dirname(__DIR__) . '/data/server_stats.json';
    
    // Criar diretório se não existir
    $data_dir = dirname($data_file);
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }
    
    // Preparar dados para salvar
    $save_data = [
        'last_update' => date('Y-m-d H:i:s'),
        'server_name' => $server_name,
        'data_type' => $data_type,
        'timestamp' => $timestamp,
        'data' => $server_data
    ];
    
    // Salvar no arquivo
    if (file_put_contents($data_file, json_encode($save_data, JSON_PRETTY_PRINT))) {
        
        // Log de sucesso
        logMessage("SUCESSO: Dados recebidos de $server_name - Tipo: $data_type - Jogadores: " . 
                  ($server_data['statistics']['online_players'] ?? 0));
        
        // Responder sucesso
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Dados recebidos e salvos com sucesso',
            'received_type' => $data_type,
            'players_online' => $server_data['statistics']['online_players'] ?? 0,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        
    } else {
        throw new Exception('Não foi possível salvar o arquivo');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro interno do servidor',
        'message' => $e->getMessage()
    ]);
    logMessage('ERRO: ' . $e->getMessage());
}
?>