import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Phone, Building2, Calendar, MessageSquare, FileText } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { type Contact } from "@shared/schema";

export default function AdminContactos() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/admin/contacts/export');
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contactos-domrealce.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting contacts:', error);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmailStats = () => {
    const uniqueEmails = new Set(contacts.map(c => c.email)).size;
    const withPhone = contacts.filter(c => c.telefone).length;
    const withCompany = contacts.filter(c => c.empresa).length;
    
    return { total: contacts.length, uniqueEmails, withPhone, withCompany };
  };

  const stats = getEmailStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-400">A carregar contactos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Base de Dados de <span className="text-[#FFD700]">Contactos</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Gestão e exportação para email marketing
              </p>
            </div>
            <Button 
              onClick={exportToCsv}
              disabled={exporting || contacts.length === 0}
              className="bg-[#20B2AA] text-black hover:bg-[#20B2AA]/90 px-6 py-3"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  A exportar...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FFD700]">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Contactos</div>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#20B2AA]">{stats.uniqueEmails}</div>
              <div className="text-sm text-gray-400">Emails Únicos</div>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FF6347]">{stats.withPhone}</div>
              <div className="text-sm text-gray-400">Com Telefone</div>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FFD700]">{stats.withCompany}</div>
              <div className="text-sm text-gray-400">Com Empresa</div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Table */}
        {contacts.length === 0 ? (
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-8 text-center">
              <Mail className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhum contacto encontrado</h3>
              <p className="text-gray-500">
                Os contactos aparecerão aqui quando os clientes submeterem o formulário
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#111111] border-[#333]">
            <CardHeader>
              <CardTitle className="text-[#FFD700] flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Lista de Contactos para Email Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#333]">
                      <TableHead className="text-gray-300">Nome</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Telefone</TableHead>
                      <TableHead className="text-gray-300">Empresa</TableHead>
                      <TableHead className="text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-300">Anexos</TableHead>
                      <TableHead className="text-gray-300">Mensagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id} className="border-[#333] hover:bg-[#1a1a1a]">
                        <TableCell className="font-medium text-white">
                          {contact.nome}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#20B2AA]" />
                            <span className="text-[#20B2AA]">{contact.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.telefone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-[#FF6347]" />
                              <span className="text-gray-300">{contact.telefone}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.empresa ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-[#FFD700]" />
                              <span className="text-gray-300">{contact.empresa}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">
                              {formatDate(contact.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.ficheiros && contact.ficheiros.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#20B2AA]" />
                              <div className="text-xs">
                                <span className="text-[#20B2AA] font-medium">{contact.ficheiros.length}</span>
                                <span className="text-gray-400"> ficheiro(s)</span>
                                <div className="max-w-xs space-y-1 mt-1">
                                  {contact.ficheiros.map((ficheiro, index) => (
                                    <div key={index} className="text-gray-300 text-xs truncate flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {ficheiro}
                                    </div>
                                  ))}
                                  <div className="text-xs text-yellow-400 mt-2">
                                    ℹ️ Os ficheiros foram anexados ao email de contacto
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Nenhum</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                            <span className="text-gray-300 text-sm truncate">
                              {contact.mensagem.length > 50 
                                ? `${contact.mensagem.substring(0, 50)}...` 
                                : contact.mensagem
                              }
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Marketing Tips */}
        <Card className="bg-gradient-to-r from-[#FFD700]/10 to-[#20B2AA]/10 border-[#FFD700] mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-[#FFD700] mb-4">💡 Dicas para Email Marketing</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-bold text-white mb-2">📊 Como usar os dados:</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Exporte CSV para importar no Mailchimp, Sendinblue, etc.</li>
                  <li>• Segmente por empresa (B2B vs particular)</li>
                  <li>• Use telefone para remarketing por WhatsApp</li>
                  <li>• Analise mensagens para identificar necessidades</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">✉️ Estratégias recomendadas:</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Newsletter mensal com novos produtos</li>
                  <li>• Campanhas sazonais (Natal, verão, etc.)</li>
                  <li>• Follow-up de orçamentos após 1 semana</li>
                  <li>• Promoções exclusivas para base de dados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <Footer />
    </div>
  );
}