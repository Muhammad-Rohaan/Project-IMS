import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/receptionist_provider.dart';
import '../../widgets/custom_text_field.dart';

class CollectFeesScreen extends StatefulWidget {
  const CollectFeesScreen({super.key});

  @override
  State<CollectFeesScreen> createState() => _CollectFeesScreenState();
}

class _CollectFeesScreenState extends State<CollectFeesScreen> {
  final _formKey = GlobalKey<FormState>();
  final _rollNoController = TextEditingController();
  final _amountController = TextEditingController();
  String _selectedMonth = 'January';
  String _selectedYear = DateTime.now().year.toString();

  final List<String> _months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  final List<String> _years = List.generate(5, (index) => (DateTime.now().year - 2 + index).toString());

  void _handleCollect() async {
    if (_formKey.currentState!.validate()) {
      final receptionistProvider = Provider.of<ReceptionistProvider>(context, listen: false);
      final success = await receptionistProvider.collectFee(
        rollNo: _rollNoController.text,
        month: _selectedMonth,
        year: _selectedYear,
        feesAmount: double.parse(_amountController.text),
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Fee collected successfully!')),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(receptionistProvider.error ?? 'Collection failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final receptionistProvider = Provider.of<ReceptionistProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Collect Fee')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomTextField(
                controller: _rollNoController,
                label: 'Student Roll No',
                prefixIcon: Icons.badge,
                validator: (value) => value == null || value.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      initialValue: _selectedMonth,
                      decoration: const InputDecoration(labelText: 'Month'),
                      items: _months.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                      onChanged: (val) => setState(() => _selectedMonth = val!),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      initialValue: _selectedYear,
                      decoration: const InputDecoration(labelText: 'Year'),
                      items: _years.map((y) => DropdownMenuItem(value: y, child: Text(y))).toList(),
                      onChanged: (val) => setState(() => _selectedYear = val!),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _amountController,
                label: 'Amount (PKR)',
                prefixIcon: Icons.payments,
                keyboardType: TextInputType.number,
                validator: (value) => value == null || double.tryParse(value) == null ? 'Invalid amount' : null,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: receptionistProvider.isLoading ? null : _handleCollect,
                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: receptionistProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Collect Fee'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
